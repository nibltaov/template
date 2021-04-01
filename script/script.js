const btn = document.querySelector('.template-item-btn')
window.addEventListener('click', function (e) {
    const el = e.target.classList.contains('template-item-btn') ? e.target : null
    if (el) {
        const template = el.previousElementSibling
        const templateN = el.nextElementSibling
        const inp = template.querySelectorAll('input')
        let temp = template.innerHTML
        inp.forEach(input => {
            const tempInput = input.outerHTML
            const val = input.value || ''
            temp = temp.replace(tempInput, val)
        });
        templateN.innerHTML = `<div class="template-gen">
            ${temp}            
    </div>`
    }
})

const divInp = document.querySelector('.create-edit')
const divResult = document.querySelector('.create-result')
divInp.addEventListener('input', function () {
    const resText = parseText(this.innerHTML)
    divResult.innerHTML = resText
})
function parseText(text) {
    const reg = /{{([\s\S]+?)}}/g
    const result = text.match(reg)
    if (result) {
        let count = 1
        result.forEach(el => {
            const data = el.replace(/[{}]/g, '').trim().split(':')
            if (data.length > 1) {
                text = text.replace(el, `**<input placeholder="${data[1]}" data-id="${count}" type="text">**`)
            } else {
                text = text.replace(el, `<input placeholder="${data[0]}" data-id="${count}" type="text">`)
            }
            count++
        })
    }
    return text
}
const crBtn = document.querySelector('.create-btn')
crBtn.addEventListener('click', function () {
    const parent = crBtn.closest('.create-content')
    const name = parent.querySelector('input')
    const content = parent.querySelector('.create-edit')
    const result = parent.querySelector('.create-result')
    if (localStorage.data) {
        const data = JSON.parse(localStorage.data)
        data.push({ id: data.length, name: name.value, content: content.innerHTML })
        localStorage.data = JSON.stringify(data)
    } else {
        const data = []
        data.push({ id: data.length, name: name.value, content: content.innerHTML })
        localStorage.data = JSON.stringify(data)
    }
    name.value = ''
    content.innerHTML = ''
    result.innerHTML = ''
    localParse()
})
let template_item = `<div id="id{{ id }}" class="template-item"><span class="template-item-name">{{ name }}</span><div class="template-item-content">{{ content }}</div><button class="template-item-btn">Сгенерировать</button><div class="template-gen"></div></div>`
const template_undefined = '<p class="template-undefined">Шаблонов еще не создано</p>'

function localParse() {
    const content = document.querySelector('.template-content')
    const count = document.querySelector('.template-title-count')
    content.innerHTML = ''
    if (localStorage.data) {
        const data = JSON.parse(localStorage.data)
        parseResponse(data, template_item, content)
        count.innerHTML = data.length
    } else {
        content.innerHTML = template_undefined
    }
}
localParse()
function parseResponse(res, temp, parent) {

    const str = temp.match(/{{([\s\S]+?)}}/g)
    res.forEach(val => {
        let item = temp
        str.forEach(i => {
            let key = i.replace(/[\{{\}}]/g, '').trim()
            item = item.replace(i, val[key])
            if (key === 'content') item = parseText(item)
            item = item.replace('hidden-element-no-display', '')
        })
        parent.insertAdjacentHTML('afterbegin', item)
    })
}

const add_btn = document.querySelector('.template-create')
const add_content = document.querySelector('.create')
add_btn.addEventListener('click', function (e) {
    e.preventDefault()
    add_content.classList.add('active')
    const parent = crBtn.closest('.create-content')
    const name = parent.querySelector('input')
    const content = parent.querySelector('.create-edit')
    const result = parent.querySelector('.create-result')
    name.value = ''
    content.innerHTML = ''
    result.innerHTML = ''
})
window.addEventListener('keydown', function (e) {
    const { ctrlKey, keyCode } = e
    if (ctrlKey && keyCode === 81) {
        e.preventDefault()
        add_content.classList.add('active')
    } else if (keyCode === 27 && add_content.classList.contains('active')) {
        add_content.classList.remove('active')
        const parent = crBtn.closest('.create-content')
        const name = parent.querySelector('input')
        const content = parent.querySelector('.create-edit')
        const result = parent.querySelector('.create-result')
        name.value = ''
        content.innerHTML = ''
        result.innerHTML = ''
    } else if(keyCode === 116) {
        e.preventDefault()
        location.reload()
    } else if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) { 
        e.preventDefault();
    }
})