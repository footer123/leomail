import React from "react";

function ResizeMenu() {
    let startX;
    let startWidth;



    const startResizing = (event) => {

        startX = event.clientX;
        startWidth = parseInt(document.defaultView.getComputedStyle(document.getElementById('preview')).width, 10);
        document.documentElement.addEventListener('mousemove', resizePreview);
        document.documentElement.addEventListener('mouseup', stopResizing);
    }
    const resizePreview = (e) =>{

        const width = startWidth + (e.clientX - startX);
        console.log('new widht ' + width)
        document.getElementById('previewContent').style.width = width + 'px';
    }

    const stopResizing = ()=> {
        document.documentElement.removeEventListener('mousemove', resizePreview);
        document.documentElement.removeEventListener('mouseup', stopResizing);
    }


    return (
        <div className="resizer" onMouseDown={startResizing} > </div>
    )
}
export default ResizeMenu
