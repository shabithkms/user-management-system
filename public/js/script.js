function deleteUser(id) {
    console.log("in delete user");
    console.log(id)
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this imaginary file!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: "/admin/delete-user",
                    method: "POST",
                    data: { id: id },
                    success: (result) => {
                        if (result.status) {
                            swal("user deleted!", {
                                icon: "success",
                            });
                            location.href = "/admin"


                        }
                    }

                })
            }

        })


}