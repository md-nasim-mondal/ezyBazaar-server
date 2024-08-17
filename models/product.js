export const createProduct = (data) => {
    return {
      name: data.name || '',
      image: data.image || '',
      description: data.description || '',
      price: data.price || 0,
      category: data.category || '',
      brand: data.brandName || '',
      ratings: data.ratings || 0,
      creation_time: new Date(),
    };
  };
  