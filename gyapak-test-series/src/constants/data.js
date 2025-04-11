import axios from 'axios'

export const getExamCategory = async () => {
    const {data} = await axios.get('http://localhost:8383/api/category/getCategories')
    console.log(data);
    return data;
}