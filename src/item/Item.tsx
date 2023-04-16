import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import axios from "axios";

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

interface ItemProps {
  id: number;
  title: string;
  completed: number;
  todosRefetch: () => void;
}

const Item = ({ id, title, completed, todosRefetch }: ItemProps) => {
  /** Edit Todo Value State */
  const [editTodo, setEditTodo] = useState<PostTodo>({
    title,
    completed,
  });

  /** 수정 버튼 클릭 여부 Sate */
  const [isEdit, setIsEdit] = useState<boolean>(false);

  /** Todo List Put */
  let { mutate: todoEditMutate } = useMutation({
    mutationFn: async (payload: PostTodo): Promise<Todo> => {
      try {
        const response = await axios.put(`${BASE_URL}/${id}`, payload);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });

  /** Todo List Put */
  let { mutate: todoDeleteMutate } = useMutation({
    mutationFn: async (id: number): Promise<Todo> => {
      try {
        const response = await axios.delete(`${BASE_URL}/${id}`);
        return response.data;
      } catch (error) {
        console.log("todo delete error => ", error);
        throw error;
      }
    },
  });

  return (
    <li>
      <p>{title}</p>
      {/* <input type="checkbox" onClick={(e) => } /> */}
      {isEdit ? (
        <>
          <input
            defaultValue={title}
            onChange={(e) =>
              setEditTodo((prev) => {
                return { ...prev, title: e.target.value };
              })
            }
          />
          <button
            onClick={() => {
              setIsEdit((prev) => !prev);
              todoEditMutate(editTodo, {
                onSuccess: () => {
                  todosRefetch();
                },
                onError: (error) => {
                  console.log("post error => ", error);
                },
              });
            }}
          >
            완료
          </button>
        </>
      ) : (
        <>
          <button onClick={() => setIsEdit((prev) => !prev)}>수정</button>
          <button
            onClick={() => {
              todoDeleteMutate(id, {
                onSuccess: () => {
                  todosRefetch();
                },
                onError: (error) => {
                  console.log("delete error => ", error);
                },
              });
            }}
          >
            삭제
          </button>
        </>
      )}
    </li>
  );
};

export default Item;
