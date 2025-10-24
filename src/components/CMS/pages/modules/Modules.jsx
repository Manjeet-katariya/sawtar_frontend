import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  TextField,
  Button,
  Switch,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ExpandMore as ExpandMoreIcon,
  DragIndicator as DragIndicatorIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { apiService } from '../../../../manageApi/utils/custom.apiservice';
import { showToast } from '../../../../manageApi/utils/toast';
import { useForm, Controller } from 'react-hook-form';

const SortableAccordion = ({ id, children, expanded, onChange }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <Accordion ref={setNodeRef} style={style} {...attributes} expanded={expanded} onChange={onChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box className="flex items-center">
          <DragIndicatorIcon {...listeners} className="cursor-grab text-gray-500 mr-2" />
          {children[0]}
        </Box>
      </AccordionSummary>
      {children[1]}
    </Accordion>
  );
};

const SortableSubAccordion = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <Accordion ref={setNodeRef} style={style} {...attributes}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box className="flex items-center">
          <DragIndicatorIcon {...listeners} className="cursor-grab text-gray-500 mr-2" />
          {children[0]}
        </Box>
      </AccordionSummary>
      {children[1]}
    </Accordion>
  );
};

const Modules = () => {
  const { token } = useSelector((state) => state.auth);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState('');
  const [subEditingKey, setSubEditingKey] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const { control, handleSubmit, reset, setValue } = useForm();
  const { control: subControl, handleSubmit: handleSubSubmit, reset: subReset } = useForm();
  const { control: addModuleControl, handleSubmit: handleAddModuleSubmit, reset: addModuleReset } = useForm();
  const { control: addSubModuleControl, handleSubmit: handleAddSubModuleSubmit, reset: addSubModuleReset } = useForm();

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    fetchModules();
  }, [token]);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const response = await apiService.get('/module', { limit: 100 });
      setModules(response.modules.sort((a, b) => a.position - b.position));
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to fetch modules', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getSubId = (sub) => sub._id || sub.tempId || `temp-${Date.now()}-${Math.random()}`;

  const isEditing = (record) => record._id === editingKey;
  const isSubEditing = (record) => getSubId(record) === subEditingKey;

  const edit = (record) => {
    setValue('name', record.name);
    setValue('description', record.description);
    setValue('icon', record.icon);
    setValue('route', record.route);
    setValue('isActive', record.isActive);
    setValue('position', record.position);
    setEditingKey(record._id);
  };

  const editSub = (moduleId, sub) => {
    setSelectedModuleId(moduleId);
    subControl.setValue('name', sub.name);
    subControl.setValue('route', sub.route);
    subControl.setValue('icon', sub.icon);
    subControl.setValue('isActive', sub.isActive);
    subControl.setValue('position', sub.position);
    setSubEditingKey(getSubId(sub));
  };

  const cancel = () => {
    setEditingKey('');
    setSubEditingKey('');
    reset();
    subReset();
  };

  const save = async (data) => {
    try {
      const updatePayload = { ...data };
      if (data.name) {
        updatePayload.slug = data.name.toLowerCase().replace(/\s+/g, '-');
      }
      console.log(updatePayload)
      const response = await apiService.put(`/module/${editingKey}`, updatePayload);
      
      const newData = [...modules];
      const index = newData.findIndex((item) => editingKey === item._id);
      if (index > -1) {
        newData[index] = response.module;
        setModules(newData.sort((a, b) => a.position - b.position));
        setEditingKey('');
        reset();
        showToast('Module updated successfully', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update module', 'error');
    }
  };

  const saveSub = async (data) => {
    try {
      const newData = [...modules];
      const moduleIndex = newData.findIndex((m) => selectedModuleId === m._id);
      if (moduleIndex > -1) {
        const subIndex = newData[moduleIndex].subModules.findIndex((s) => getSubId(s) === subEditingKey);
        if (subIndex > -1) {
          const updatedSubModules = [...newData[moduleIndex].subModules];
          updatedSubModules[subIndex] = { ...updatedSubModules[subIndex], ...data };
          updatedSubModules.sort((a, b) => a.position - b.position);
          const updatePayload = { subModules: updatedSubModules.map(({ tempId, ...rest }) => rest) };
          const response = await apiService.put(`/module/${selectedModuleId}`, updatePayload);
          newData[moduleIndex] = response.module;
          setModules(newData);
          setSubEditingKey('');
          subReset();
          showToast('Sub-module updated successfully', 'success');
        } else {
          throw new Error('Sub-module not found');
        }
      } else {
        throw new Error('Module not found');
      }
    } catch (error) {
      showToast(error.response?.data?.message || error.message || 'Failed to update sub-module', 'error');
    }
  };

  const handleDelete = async (key) => {
    try {
      await apiService.delete(`/module/${key}`);
      setModules(modules.filter((item) => item._id !== key));
      showToast('Module deleted successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete module', 'error');
    }
  };

  const handleDeleteSub = async (moduleId, subId) => {
    try {
      const newData = [...modules];
      const moduleIndex = newData.findIndex((m) => moduleId === m._id);
      if (moduleIndex > -1) {
        const updatedSubModules = newData[moduleIndex].subModules
          .filter((s) => getSubId(s) !== subId)
          .map((s, idx) => ({ ...s, position: idx }));
        const updatePayload = { subModules: updatedSubModules.map(({ tempId, ...rest }) => rest) };
        const response = await apiService.put(`/module/${moduleId}`, updatePayload);
        newData[moduleIndex] = response.module;
        setModules(newData);
        showToast('Sub-module deleted successfully', 'success');
      } else {
        throw new Error('Module not found');
      }
    } catch (error) {
      showToast(error.response?.data?.message || error.message || 'Failed to delete sub-module', 'error');
    }
  };

  const handleAddModule = async (data) => {
    try {
      const newModule = {
        name: data.name,
        route: data.route,
        description: data.description,
        icon: data.icon || 'fas fa-folder',
        position: modules.length,
        subModules: [],
      };
      const response = await apiService.post('/module', newModule);
      setModules([...modules, response.modules[0]].sort((a, b) => a.position - b.position));
      setIsModalOpen(false);
      addModuleReset();
      showToast('Module added successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to add module', 'error');
    }
  };

  const handleAddSub = async (data) => {
    try {
      const newData = [...modules];
      const moduleIndex = newData.findIndex((m) => selectedModuleId === m._id);
      if (moduleIndex > -1) {
        const tempId = `temp-${Date.now()}`;
        const newSub = {
          name: data.name,
          route: data.route,
          icon: data.icon || 'fas fa-circle',
          isActive: data.isActive !== undefined ? data.isActive : true,
          position: data.position || newData[moduleIndex].subModules.length,
          tempId,
        };
        const updatedSubModules = [...newData[moduleIndex].subModules, newSub].sort(
          (a, b) => a.position - b.position
        );
        const updatePayload = { subModules: updatedSubModules.map(({ tempId, ...rest }) => rest) };
        const response = await apiService.put(`/module/${selectedModuleId}`, updatePayload);
        newData[moduleIndex] = response.module;
        setModules(newData);
        setIsSubModalOpen(false);
        addSubModuleReset();
        showToast('Sub-module added successfully', 'success');
      } else {
        throw new Error('Module not found');
      }
    } catch (error) {
      showToast(error.response?.data?.message || error.message || 'Failed to add sub-module', 'error');
    }
  };

  const openAddSubModal = (moduleId) => {
    setSelectedModuleId(moduleId);
    setIsSubModalOpen(true);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = modules.findIndex((m) => m._id === active.id);
      const newIndex = modules.findIndex((m) => m._id === over.id);
      const newModules = arrayMove(modules, oldIndex, newIndex).map((m, idx) => ({ ...m, position: idx }));
      setModules(newModules);
      try {
        const reorderPayload = newModules.map((m) => ({ _id: m._id, position: m.position }));
        await apiService.put('/module/reorder', { modules: reorderPayload });
        showToast('Module order updated successfully', 'success');
        await fetchModules();
      } catch (error) {
        showToast(error.response?.data?.message || 'Failed to update module order', 'error');
      }
    }
  };

  const handleSubDragEnd = async (event, moduleId) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      try {
        const newData = [...modules];
        const moduleIndex = newData.findIndex((m) => moduleId === m._id);
        if (moduleIndex > -1) {
          const oldIndex = newData[moduleIndex].subModules.findIndex((s) => getSubId(s) === active.id);
          const newIndex = newData[moduleIndex].subModules.findIndex((s) => getSubId(s) === over.id);
          const newSubs = arrayMove(newData[moduleIndex].subModules, oldIndex, newIndex).map((s, idx) => ({
            ...s,
            position: idx,
          }));
          const updatePayload = { subModules: newSubs.map(({ tempId, ...rest }) => rest) };
          const response = await apiService.put(`/module/${moduleId}`, updatePayload);
          newData[moduleIndex] = response.module;
          setModules(newData);
          showToast('Sub-module order updated successfully', 'success');
        } else {
          throw new Error('Module not found');
        }
      } catch (error) {
        showToast(error.response?.data?.message || error.message || 'Failed to update sub-module order', 'error');
      }
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const fields = [
    { id: 'name', label: 'Name', editable: true, render: (text) => <Typography className="font-bold">{text}</Typography> },
    { id: 'description', label: 'Description', editable: true, render: (text) => <Typography>{text || '-'}</Typography> },
    { id: 'icon', label: 'Icon', editable: true, render: (text) => <Typography>{text || 'fas fa-folder'}</Typography> },
    { id: 'route', label: 'Route', editable: true, render: (text) => <Typography>{text}</Typography> },
    { id: 'subModules', label: 'Sub-Modules', render: (subs) => <Chip label={subs?.length || 0} color="primary" size="small" /> },
    { id: 'isActive', label: 'Active', editable: true, inputType: 'switch', render: (text) => <Switch checked={text} disabled /> },
    { id: 'position', label: 'Position', editable: true, render: (text) => <Typography>{text}</Typography> },
  ];

  const subFields = [
    { id: 'name', label: 'Name', editable: true, render: (text) => <Typography>{text}</Typography> },
    { id: 'route', label: 'Route', editable: true, render: (text) => <Typography>{text}</Typography> },
    { id: 'icon', label: 'Icon', editable: true, render: (text) => <Typography>{text || 'fas fa-circle'}</Typography> },
    { id: 'isActive', label: 'Active', editable: true, inputType: 'switch', render: (text) => <Switch checked={text} disabled /> },
    { id: 'position', label: 'Position', editable: true, render: (text) => <Typography>{text}</Typography> },
  ];

  return (
    <Box className="p-6 bg-white rounded-lg shadow-md">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="font-bold">Modules Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Add Module
        </Button>
      </Box>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Module</DialogTitle>
        <DialogContent>
          <form onSubmit={handleAddModuleSubmit(handleAddModule)}>
            <Controller
              name="name"
              control={addModuleControl}
              rules={{ required: 'Please input the module name!', maxLength: { value: 50, message: 'Name cannot exceed 50 characters' } }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Module Name"
                  fullWidth
                  margin="normal"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  className="mt-2"
                />
              )}
            />
            <Controller
              name="route"
              control={addModuleControl}
              rules={{ required: 'Please input the module route!' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Route"
                  fullWidth
                  margin="normal"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  placeholder="e.g., /dashboard"
                />
              )}
            />
            <Controller
              name="description"
              control={addModuleControl}
              rules={{ maxLength: { value: 300, message: 'Description cannot exceed 300 characters' } }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  placeholder="Enter description"
                />
              )}
            />
            <Controller
              name="icon"
              control={addModuleControl}
              defaultValue="fas fa-folder"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Icon"
                  fullWidth
                  margin="normal"
                  placeholder="e.g., fas fa-folder"
                />
              )}
            />
            <Controller
              name="position"
              control={addModuleControl}
              defaultValue={modules.length}
              rules={{ required: 'Please input the position!', min: { value: 0, message: 'Position must be non-negative' } }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Position"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setIsModalOpen(false); addModuleReset(); }} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleAddModuleSubmit(handleAddModule)} variant="contained" className="bg-blue-500 hover:bg-blue-600">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Sub-Module</DialogTitle>
        <DialogContent>
          <form onSubmit={handleAddSubModuleSubmit(handleAddSub)}>
            <Controller
              name="name"
              control={addSubModuleControl}
              rules={{ required: 'Please input the sub-module name!', maxLength: { value: 50, message: 'Name cannot exceed 50 characters' } }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Sub-Module Name"
                  fullWidth
                  margin="normal"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  className="mt-2"
                />
              )}
            />
            <Controller
              name="route"
              control={addSubModuleControl}
              rules={{ required: 'Please input the sub-module route!' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Route"
                  fullWidth
                  margin="normal"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  placeholder="e.g., /dashboard/sub"
                />
              )}
            />
            <Controller
              name="icon"
              control={addSubModuleControl}
              defaultValue="fas fa-circle"
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Icon"
                  fullWidth
                  margin="normal"
                  placeholder="e.g., fas fa-circle"
                />
              )}
            />
            <Controller
              name="isActive"
              control={addSubModuleControl}
              defaultValue={true}
              render={({ field }) => (
                <Box className="flex items-center mt-4">
                  <Switch {...field} checked={field.value} />
                  <Typography variant="body2" className="ml-2">Active</Typography>
                </Box>
              )}
            />
            <Controller
              name="position"
              control={addSubModuleControl}
              defaultValue={
                modules.find((m) => m._id === selectedModuleId)?.subModules.length || 0
              }
              rules={{ required: 'Please input the position!', min: { value: 0, message: 'Position must be non-negative' } }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Position"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setIsSubModalOpen(false); addSubModuleReset(); }} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleAddSubModuleSubmit(handleAddSub)} variant="contained" className="bg-blue-500 hover:bg-blue-600">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={modules.map((m) => m._id)} strategy={verticalListSortingStrategy}>
          {modules.map((record) => (
            <SortableAccordion
              key={record._id}
              id={record._id}
              expanded={expanded === `panel${record._id}`}
              onChange={handleAccordionChange(`panel${record._id}`)}
            >
              <AccordionSummary>
                <Typography>{record.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box className="flex flex-col gap-4">
                  {fields.map((field) => (
                    <Box key={field.id} className="flex items-center gap-2">
                      <Typography variant="subtitle2" className="w-1/4">{field.label}:</Typography>
                      {field.editable && isEditing(record) ? (
                        <Controller
                          name={field.id}
                          control={control}
                          rules={{
                            required: field.inputType !== 'switch' ? `Please input ${field.label}!` : false,
                            validate:
                              field.id === 'position'
                                ? (value) =>
                                    value >= 0
                                      ? true
                                      : 'Position must be a non-negative number'
                                : undefined,
                          }}
                          render={({ field: controllerField, fieldState }) => (
                            field.inputType === 'switch' ? (
                              <Switch {...controllerField} checked={controllerField.value} />
                            ) : (
                              <TextField
                                {...controllerField}
                                size="small"
                                fullWidth
                                type={field.id === 'position' ? 'number' : 'text'}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                className="w-3/4"
                              />
                            )
                          )}
                        />
                      ) : (
                        <Box className="w-3/4">
                          {field.render ? field.render(record[field.id], record) : record[field.id]}
                        </Box>
                      )}
                    </Box>
                  ))}
                  <Box className="flex gap-2 mt-4">
                    {isEditing(record) ? (
                      <>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleSubmit(save)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Save
                        </Button>
                        <Button variant="outlined" size="small" onClick={cancel}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <IconButton
                          disabled={editingKey !== '' || subEditingKey !== ''}
                          onClick={() => edit(record)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          disabled={editingKey !== '' || subEditingKey !== ''}
                          onClick={() => handleDelete(record._id)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                        <Button
                          disabled={editingKey !== '' || subEditingKey !== ''}
                          onClick={() => openAddSubModal(record._id)}
                          startIcon={<AddIcon />}
                          size="small"
                          variant="outlined"
                        >
                          Add Sub
                        </Button>
                      </>
                    )}
                  </Box>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleSubDragEnd(e, record._id)}>
                    <SortableContext items={record.subModules?.map(getSubId) || []} strategy={verticalListSortingStrategy}>
                      <Box className="mt-4">
                        <Typography variant="h6">Sub-Modules</Typography>
                        {record.subModules?.length > 0 ? (
                          record.subModules.map((sub) => (
                            <SortableSubAccordion key={getSubId(sub)} id={getSubId(sub)}>
                              <AccordionSummary>
                                <Typography>{sub.name}</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Box className="flex flex-col gap-4">
                                  {subFields.map((field) => (
                                    <Box key={field.id} className="flex items-center gap-2">
                                      <Typography variant="subtitle2" className="w-1/4">{field.label}:</Typography>
                                      {field.editable && isSubEditing(sub) ? (
                                        <Controller
                                          name={field.id}
                                          control={subControl}
                                          rules={{
                                            required: field.inputType !== 'switch' ? `Please input ${field.label}!` : false,
                                            validate:
                                              field.id === 'position'
                                                ? (value) =>
                                                    value >= 0
                                                      ? true
                                                      : 'Position must be a non-negative number'
                                                : undefined,
                                          }}
                                          render={({ field: controllerField, fieldState }) => (
                                            field.inputType === 'switch' ? (
                                              <Switch {...controllerField} checked={controllerField.value} />
                                            ) : (
                                              <TextField
                                                {...controllerField}
                                                size="small"
                                                fullWidth
                                                type={field.id === 'position' ? 'number' : 'text'}
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                                className="w-3/4"
                                              />
                                            )
                                          )}
                                        />
                                      ) : (
                                        <Box className="w-3/4">
                                          {field.render ? field.render(sub[field.id], sub) : sub[field.id]}
                                        </Box>
                                      )}
                                    </Box>
                                  ))}
                                  <Box className="flex gap-2 mt-4">
                                    {isSubEditing(sub) ? (
                                      <>
                                        <Button
                                          variant="contained"
                                          size="small"
                                          onClick={handleSubSubmit(saveSub)}
                                          className="bg-blue-500 hover:bg-blue-600"
                                        >
                                          Save
                                        </Button>
                                        <Button variant="outlined" size="small" onClick={cancel}>
                                          Cancel
                                        </Button>
                                      </>
                                    ) : (
                                      <>
                                        <IconButton
                                          disabled={editingKey !== '' || subEditingKey !== ''}
                                          onClick={() => editSub(record._id, sub)}
                                          size="small"
                                        >
                                          <EditIcon />
                                        </IconButton>
                                        <IconButton
                                          disabled={editingKey !== '' || subEditingKey !== ''}
                                          onClick={() => handleDeleteSub(record._id, getSubId(sub))}
                                          size="small"
                                          color="error"
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      </>
                                    )}
                                  </Box>
                                </Box>
                              </AccordionDetails>
                            </SortableSubAccordion>
                          ))
                        ) : (
                          <Typography>No sub-modules available</Typography>
                        )}
                      </Box>
                    </SortableContext>
                  </DndContext>
                </Box>
              </AccordionDetails>
            </SortableAccordion>
          ))}
        </SortableContext>
      </DndContext>
    </Box>
  );
};

export default Modules;