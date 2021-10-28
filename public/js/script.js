// const swal=require('sweetalert')
function deleteUser(id) {
    console.log("in delete user");
    console.log(id)
    // swal({
    //     title: "Are you sure?",
    //     text: "Once deleted, you will not be able to recover this User!",
    //     icon: "warning",
    //     buttons: true,
    //     dangerMode: true,
    // })
    //     .then((willDelete) => {
    //         if (willDelete) {
    //             $.ajax({
    //                 url: "/admin/delete-user",
    //                 method: "POST",
    //                 data: { id: id },
    //                 success: (result) => {
    //                     if (result.status) {
    //                         swal("user deleted!", {
    //                             icon: "success",
    //                         });
    //                         location.href = "/admin"


    //                     }
    //                 }

    //             })
    //         }

    //     })
    // swal("Hello world!");
    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire('Saved!', '', 'success')
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })


}
// deleteUser()