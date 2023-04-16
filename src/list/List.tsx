import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import Item from "../item";
import { useState } from "react";

const BASE_URL: string = process.env.REACT_APP_SERVER!;

interface Todo {
  id: number;
  title: string;
  completed: number;
}

interface PostTodo {
  title: string;
  completed: number;
}

const List = () => {
  /** Todo Value State */
  const [todo, setTodo] = useState<Todo>({ id: 0, title: "", completed: 0 });

  /** Todo List Get */
  let { data: todos, refetch: todosRefetch } = useQuery<Todo[]>(
    ["todos"],
    async () => {
      try {
        const response = await axios.get(BASE_URL);

        return response.data;
      } catch (error) {
        console.log("get error => ", error);
        // throw error;
      }
    }
  );

  /** Todo List Post */
  let { mutate: todoMutate } = useMutation({
    mutationFn: async (payload: PostTodo): Promise<Todo> => {
      try {
        const response = await axios.post(BASE_URL, payload);
        return response.data;
      } catch (error) {
        console.log("todo post error => ", error);
        throw error;
      }
    },
  });

  return (
    <div>
      <ul>
        {todos?.map(({ id, title, completed }) => (
          <Item
            key={id}
            id={id}
            title={title}
            completed={completed}
            todosRefetch={todosRefetch}
          />
        ))}
      </ul>
      <input
        value={todo.title}
        onChange={(e) => {
          setTodo((prev) => {
            return { ...prev, title: e.target.value, completed: 0 };
          });
        }}
      />
      <button
        onClick={() => {
          setTodo((prev) => {
            return { ...prev, title: "" };
          });
          todoMutate(todo, {
            onSuccess: () => {
              todosRefetch();
            },
            onError: (error) => {
              console.log("post error => ", error);
            },
          });
        }}
      >
        추가
      </button>
    </div>
  );
};

export default List;
