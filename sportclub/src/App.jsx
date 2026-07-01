import { useEffect, useState } from "react";
import UserCard from "./components/UserCard";
import "./App.css";
import { getUsers } from "./services/userService";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://fake-json-api.mock.beeceptor.com/users/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener la información");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      })
  }, []);

  if (loading) {
    return <p className="loading">Cargando usuarios...</p>;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  return (
    <main className="container">
      <h1>Usuarios desde API</h1>
      <p className="subtitle">
        Datos obtenidos desde una API pública y redenterizados con componentes React.
      </p>
        
      <section className="user-grid">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </section>
    </main>
  )
}

export default App