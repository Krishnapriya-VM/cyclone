const blockbtns = document.querySelectorAll('.blockbtn');
const unblockbtns = document.querySelectorAll('.unblockbtn');

function block(id) {
    fetch(`/admin/block-and-unblock-users?id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.blocked) {
                window.location.reload();
                console.log(data.blocked)
            } else {
                console.log("Error: User not blocked.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
        });
}

function unblock(id) {
    fetch(`/admin/block-and-unblock-users?id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.unblocked) {
                window.location.reload();
                console.log(data.unblocked)
            } else {
                console.log("Error: User not unblocked.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
        });
}


if (blockbtns) {
    blockbtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.uid;
            // const confirmResult = confirm("Are you sure you want to block this user?");
            Swal.fire({
                title: 'Are you sure!',
                text: 'You want to block this user',
                timer: 30000,
                confirmCancelButton: true,
                confirmCancelButton: 'Cancel',
                confirmButtonText: 'Ok'
            })
            .then((result) =>{
                if (result.isConfirmed) {
                    block(id);
                }
            })

        });
    });
}

if (unblockbtns) {
    unblockbtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.uid;
            Swal.fire({
                title: 'Are you sure!',
                text: 'You want to unblock this user',
                timer: 30000,
                confirmCancelButton: true,
                confirmCancelButton: 'Cancel',
                confirmButtonText: 'Ok'
            })
            .then((result) =>{
                if (result.isConfirmed) {
                    unblock(id);
                }
            })
            //const confirmResult = confirm("Are you sure you want to unblock this user?");
            // if (confirmResult) {
            //     unblock(id);
            // }
        });
    });
}