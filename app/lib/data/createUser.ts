import { fetchUserData } from './fetch';

const apiUrl = `https://api.cursosya.info/api/clients`;

export const createUserDB = async ({ user }: { user: UserDataAPI }) => {
  const userData = {
    auth_id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al enviar la solicitud:', error);
  }
};

export const validateUser = async ({ user }: { user: UserDataAPI }) => {
  const { id, name, email, image } = user;

  try {
    const user = await fetchUserData({ email: email as string });
    if (user.data.length === 0) {
      const newUser: UserDataAPI = {
        id: id,
        name: name,
        email: email,
        image: image,
      };
      await createUserDB({ user: newUser });
    }
  } catch (error) {
    console.error('Error fetching more data:', error);
  }
};
