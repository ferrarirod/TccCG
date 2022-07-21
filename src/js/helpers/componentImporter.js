function importComponent(url,nodeId)
{
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onreadystatechange = function() {
        if (this.readyState!==4) return
        if (this.status!==200) return
        
        let node = document.getElementById(nodeId)
        let placeholder = document.createElement('div')
        placeholder.innerHTML = this.responseText
        let newNode = placeholder.firstElementChild
        node.replaceWith(newNode)
    }

    xhr.send()
}