const socket = io()

const form = document.getElementById('productForm')
form.addEventListener('submit', e => {
    e.preventDefault()
    const product = {
        title: form.title.value,
        description: form.description.value,
        price: parseFloat(form.price.value),
        thumbnail: form.thumbnail.value,
        code: form.code.value,
        stock: parseInt(form.stock.value),
        status: form.status.checked,
        category: form.category.value
    }

    if (isNaN(product.price) || isNaN(product.stock)) {
        return alert('Price y Stock deben ser números válidos')
    }

    socket.emit('new-product', product)
    form.reset()
})

socket.on('products', products => {
    const list = document.getElementById('productList')
    list.innerHTML = ''
    products.forEach(p => {
        const item = document.createElement('li')
        item.innerText = `${p.title} - $${p.price}`
        list.appendChild(item)
    })
})
