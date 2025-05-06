import {supabase} from '../modules/database.js';
import { getUserID } from './user.js';

const fetchTask = async (userID) => {
    const {data, error} = await supabase
        .from('task')
        .select('*').eq('userID', userID)

    if (error) {
        console.log(`upper error: ${error.message}`);
    }
    
    return {data}
}

const insertTask = async (title, description, userID) => {
    const {data, error} = await supabase
        .from('task')
        .insert([{
            title: title,
            description: description,
            userID: userID,
            createdAt: new Date(Date.now()),
            lastUpdated: new Date(Date.now())
        }]);
    
    if (error) {
        console.log(error.message);
    }
}  

const updateTask = async (title, description, completion, taskID) => {
    const {data, error} = await supabase
        .from('task')
        .update([{
            title: title,
            description: description,
            completion: completion,
            lastUpdated: new Date(Date.now())
        }]).eq('taskID', taskID);

    if (error) {
        console.log("Update error: ",error.message);
    }
}

const removeTask = async (taskID) => {
    const {data, error} = await supabase
        .from('task')
        .delete('*').eq('taskID', taskID)
}

export const getTask = async (req, res) => {
    try { 
        const email = req.cookies["refresh_token"][1]
        const userID = await getUserID(email)

        const tasks = await fetchTask(userID);
        console.log(tasks);
        return res.status(200).json({"message": "Get successful!",
            "tasks": tasks
        });
    } catch(error) {
        return res.status(500).json({"message": error.message});
    }
}

export const addTask = async (req, res) => {
    const {title, description} = req.body;
    
    try {
        // validate title and description
        
        if (!title || !description) {
            return res.status(400).json({"message": "All fields must be filled."})
        }

        if (title.length > 50 || description.length > 2000) {
            return res.status(400).json({"message": "Input too long. Please reduce length."})
        }

        // get user id from cookies
        
        const email = req.cookies["refresh_token"][1]
        const userID = await getUserID(email)

        await insertTask(title, description, userID);

        return res.status(200).json({"message": "Insertion successful!",
                            "title": title,
                            "description":description,
                            "userID": userID
        });
    } catch (error) {
        return res.status(500).json({"message": `Hello world${error.message}`});
    }
}

export const editTask = async (req, res) => {
    const {title, description, completion} = req.body;
    const taskID = req.params.id;
    try {
        if (!title || !description) {
            return res.status(400).json({"message": "All fields must be filled."})
        }
        if (title.length > 50 || description.length > 2000 || (completion!=true && completion != false)) {
            return res.status(400).json({"message": "Input too long. Please reduce length."})
        }

        await updateTask(title, description, completion, taskID);

        res.status(200).json({"message": "Task successfully updated",
            "title": title,
            "description": description,
            "completion": completion
        });

    } catch (error) {
        res.status(500).json({"message": error.message});
    }
}

export const deleteTask = async (req, res) => {
    const taskID = req.params.id;

    try {
        await removeTask(taskID);
        res.status(200).json({"message": "Task successfully deleted"})
    } catch (error) {
        res.status(500).json({"message": "Server error"})
    }
};