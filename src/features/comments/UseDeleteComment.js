import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const UseDeleteComment = ({onSuccess}) => {
    return useMutation({
        mutationFn: async (id) => {
            
            const res = await axios.delete(`https://jsonplaceholder.typicode.com/comments/${id}`)

            return res
        },
        onSuccess
    })
}