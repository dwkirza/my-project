import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const UseCreateComment = ({onSuccess}) => {
    return useMutation({
        mutationFn : async (body) => {
            const res = await axios.post("https://jsonplaceholder.typicode.com/comments", body)

            return res
        },
        onSuccess
    })
}