import Swal from 'sweetalert2';

export const showSuccessAlert = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonColor: '#3085d6',
  });
};

export const showErrorAlert = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonColor: '#d33',
  });
};

export const showConfirmDialog = (title, text, confirmButtonText = 'Confirm') => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText,
    cancelButtonText: 'Cancel',
  });
};

export const showCustomHtmlAlert = (title, html) => {
  return Swal.fire({
    title,
    html,
    showConfirmButton: false,
    showCloseButton: true,
  });
};