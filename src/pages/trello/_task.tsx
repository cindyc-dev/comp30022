import { TaskI } from "~/types/TaskI";

function Task({ task }: { task: TaskI }) {
  console.log(task);
  return <div>Task</div>;
}

export default Task;
