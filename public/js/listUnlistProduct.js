
const unlistbtn = document.querySelectorAll('.unlistbtn');
const listbtn = document.querySelectorAll('.listbtn');

function unlist(id) {
    fetch(`/admin/products/listUnlist?id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.unlist) {
                window.location.reload();
                console.log(data.unlist)
            } else {
                console.log("Error: Product not unlisted.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
        });
}

function list(id) {
    fetch(`/admin/products/listUnlist?id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.list) {
                window.location.reload();
                console.log(data.list)
            } else {
                console.log("Error: Product not listed.");
            }
        })
        .catch(err => {
            console.error("Error:", err);
        });
}



if (unlistbtn) {
    unlistbtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.uid;
            console.log(id);
            const confirmResult = confirm("Are you sure you want to list this product?");
            if (confirmResult) {
                unlist(id);
            }
        });
    });
}

if (listbtn) {
    listbtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.uid;
            console.log(id);
            const confirmResult = confirm("Are you sure you want to unlist this product?");
            console.log(confirmResult);
            if (confirmResult) {
                list(id);
            }
        });
    });
}
