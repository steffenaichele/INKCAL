import { useUsers } from "../hooks/useUsers";

const Home = () => {
	const { data: users, isLoading, error } = useUsers();

	if (isLoading) return <div>Lädt Users...</div>;
	if (error) return <div>Fehler: {error.message}</div>;

	return (
		<div>
			<h1>User Liste</h1>
			<ul>
				{users?.map((user) => (
					<li key={user._id}>
						{user.name} - {user.email}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Home;
