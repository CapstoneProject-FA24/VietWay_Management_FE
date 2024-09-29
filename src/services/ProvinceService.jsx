import baseURL from '@api/baseURL'

export const fetchProvinces = async () => {
    try {
        const response = await fetch(`${baseURL}/api/Province`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        return result.data.map(item => ({
            ProvinceId: item.provinceId,
            ProvinceName: item.provinceName
        }));
    } catch (error) {
        console.error('Error fetching tour templates:', error);
        throw error;
    }
};