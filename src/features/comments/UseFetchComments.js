import axios from "axios";
import { useQuery } from "@tanstack/react-query";


export const UseFetchComments = () => {
    const {data:dataComments, isLoading: isLoadingComments, refetch: refetchComments} = useQuery({
         queryKey: ['dataComments'],
        queryFn: async () => {
            const res = await axios.get("https://jsonplaceholder.typicode.com/comments")
            return res.data ?? [];
        }
    })
    return{
        dataComments,
        isLoadingComments,
        refetchComments
    }
}