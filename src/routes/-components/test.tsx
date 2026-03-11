export default function List() {
  const array = [
    { name: "dezz", id: 101, price: 22234 },
    { name: "soso", id: 102, price: 22234 },
    { name: "remaz", id: 103, price: 42234 },
  ];
  return (
    <div>
      <ul>
        {array.map((item) => {
          if (item.price > 30000)
            return (
              <li
                style={{
                  color: "red",
                }}
              >
                {item.name}
              </li>
            );
          return <li>{item.name}</li>;
        })}
      </ul>
    </div>
  );
}
