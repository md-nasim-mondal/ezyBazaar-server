export const createProduct = (data) => {
    return {
      name: data.name || '',
      image: data.image || '',
      description: data.description || '',
      price: data.price || 0,
      category: data.category || '',
      brandName: data.brandName || '',
      ratings: data.ratings || 0,
      createdAt: new Date(),
    };
  };
  