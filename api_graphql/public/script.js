            
async function fetchProducts() {
    const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                {
                products {
                    id
                    name
                    value
                }
                }
            `,
        }),
    });

    if (!response.ok) {
        console.error('Error en la solicitud GraphQL:', response.statusText);
        return;
    }

    const data = await response.json();
    console.log(data);
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    data.data.products.forEach(product => {
        const li = document.createElement('div');
        li.className = 'product-item';
        li.innerHTML = `
            <span>ID: ${product.id}, Nombre: ${product.name}, Valor: $${product.value}</span>
            <button onclick="showEditForm('${product.id}', '${product.name}', ${product.value})">
                Editar
            </button>
        `;
        productList.appendChild(li);
    });
}

function showEditForm(id, name, value) {
    document.getElementById('editProductId').value = id;
    document.getElementById('editProductName').value = name;
    document.getElementById('editProductValue').value = value;
    document.getElementById('edit-form').classList.remove('hidden');
}

function cancelEdit() {
    document.getElementById('edit-form').classList.add('hidden');
}


async function updateProduct() {
    const id = document.getElementById('editProductId').value;
    const name = document.getElementById('editProductName').value;
    const value = parseFloat(document.getElementById('editProductValue').value);

    if (!name || isNaN(value)) {
        alert('Por favor, ingresa un nombre y un valor válido.');
        return;
    }

    const escapedProductName = name.replace(/"/g, '\\"');
    const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
                mutation {
                    updateProduct(id: "${id}", name: "${escapedProductName}", value: ${value}) {
                        id
                        name
                        value
                    }
                }
            `,
        }),
    });

    if (!response.ok) {
        console.error('Error al actualizar producto:', response.statusText);
        return;
    }

    const data = await response.json();
    if (data.errors) {
        console.error('Error en la mutación:', data.errors);
        alert('Error al actualizar el producto');
        return;
    }

    // Ocultar el formulario de edición
    document.getElementById('edit-form').classList.add('hidden');

    // Recargar la lista de productos
    await fetchProducts();
}


async function addProduct() {
    const productName = document.getElementById('productName').value;
    const productValue = parseFloat(document.getElementById('productValue').value);

    if (!productName || isNaN(productValue)) {
        alert('Ingresa un nombre y un valor válido.');
        return;
    }

    const escapedProductName = productName.replace(/"/g, '\\"');
    const response = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        query: `
            mutation {
                addProduct(name: "${escapedProductName}", value: ${productValue}) {
                    id
                    name
                    value
                }
            }
        `,
        }),
    });
    await fetchProducts();

    document.getElementById('productName').value = '';
    document.getElementById('productValue').value = '';
}
