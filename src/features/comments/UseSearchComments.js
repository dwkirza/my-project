import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store/useStore";

export const UseFetchCommentsSearch = () => {
    const {keyword} = useStore()
    const { data: dataCommentsSearch, isLoading: isLoadingCommentsSearch } = useQuery(
        keyword && keyword.trim() ? {
            queryKey: ['dataCommentsSearch', keyword],
            queryFn: async () => {
                const res = await axios.get(`https://jsonplaceholder.typicode.com/comments?q=${keyword}`);
                return res.data ?? [];
            },
        } : {
            // Jika keyword kosong, matikan query
            enabled: false,
        }
    );
    return{
        dataCommentsSearch,
        isLoadingCommentsSearch
    }
}