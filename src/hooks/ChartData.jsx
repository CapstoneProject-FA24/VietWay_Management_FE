import { useState, useEffect } from 'react';
import { fetchProvinces } from '@services/ProvinceService';

export const useProvinceChartData = () => {
  const [provinceData, setProvinceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock categories and their ranges for random data
  const categories = {
    "Du lịch": { min: 50, max: 200 },
    "Ẩm thực": { min: 30, max: 150 },
    "Văn hóa": { min: 20, max: 120 },
    "Giải trí": { min: 25, max: 130 },
    "Khách sạn": { min: 15, max: 100 }
  };

  // Generate random number within range
  const getRandomValue = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all provinces
        const response = await fetchProvinces({ pageSize: 63, pageIndex: 1 });
        
        // Create data object with provinces and random category values
        const data = response.items.reduce((acc, province) => {
          acc[province.provinceName] = Object.keys(categories).reduce((catAcc, category) => {
            catAcc[category] = getRandomValue(
              categories[category].min,
              categories[category].max
            );
            return catAcc;
          }, {});
          return acc;
        }, {});

        setProvinceData(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { provinceData, loading, error };
};
