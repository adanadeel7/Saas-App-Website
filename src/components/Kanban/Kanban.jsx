import { Heart, ReceiptRussianRuble } from 'lucide-react';
import React, { useState } from 'react'

function Kanban() {
    const [columns, setColumns] = useState({
        todo:{ 
            name:"To do", 
            items:[
                {id:'1', content:"Market Research"},
                {id:'2' , content:"Market Research"},
                {id:'3' , content:"Market Research"},

            ]
        }, 
        inProgress:{ 
            name:"In Progress", 
            items: [
                {id:'4', content:"Design UI "},
            

            ]

        }, 

        done:{ 
            name:"Done", 
            items: [
                {id:'5', content:"Push to Git"},
               

            ]
        }

    })

    const [newTask, setNewTask] = useState("");
    const [activeColumn, setActiveColumn] = useState("todo")
    const [draggedItem, setDraggedItem] = useState(null)

    const addNewTask = () => { 
        if (newTask.trim() === "") return;
        const updateColumns = {...columns};

        updateColumns(activeColumn).items.push({
            id:Date.now().toString(), 
            content : newTask,
        }); 

        setColumns(updateColumns)
        setNewTask(""); 
    }

    const removeTask = (columnId,taskid) => { 
        const updatedColumns = {...columns}; 
        updatedColumns[columnId].items = updatedColumns[columnId].items.filter((item) => item.id !== taskId);
        setColumns(updatedColumns)
    }

    const handleDragStart = (columnId, item) => { 
        setDraggedItem({columnId,item})
    }

    const handleDragOver = (e) => { 
        e.preventDefault()
    }
  

    const handleDrop = (e,columnId) => { 
        e.preventDefault()

        if (!draggedItem) return; 

        const {columnId: sourceColumnId,item} = draggedItem;
        if(sourceColumnId === columnId) return; 

        const updatedColumns = {...columns}; 

        updatedColumns[sourceColumnId].items = updatedColumns[sourceColumnId].items.filter((i)=> i.id != item.id)
        updatedColumns[columnId].items.push(item)
        setColumns(updatedColumns)
        setDraggedItem(null)
    }
    
    const columnStyles = { 
        todo: { 
            header: "bg-gradient-to-r from-blue-600 to-blue-400", 
            border: "border-blue-400"
        },

        inProgress: { 
            header: "bg-gradient-to-r from-yellow-600 to-yellow-400", 
            border: "border-yellow-400"
        },

        todo: { 
            header: "bg-gradient-to-r from-green-600 to to-green-400", 
            border: "border-green-400"
        }
    }
    
    
    
    return (
    <>
        <div className='p-6 w-full min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 flex items-center justify-center'>
            <div className='flex items-center justify-center flex-col gap-4 w-full max-w-full-6xl'>
                <h1 className='text-6xl font-bold mb-8 text-transparent'>
                    Kanban Board
                </h1>

            </div>

        </div>
    </>
  )
}

export default Kanban