import React, { useState, useEffect, useRef } from "react";
import {
  Header,
  HeaderContainer,
  HeaderName,
  Button,
  TextInput,
  Form,
  FormItem,
  Select,
  SelectItem,
  SelectItemGroup,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableToolbar,
  TableBatchActions,
  TableBatchAction,
  TableToolbarSearch,
  TableToolbarContent,
  TableSelectAll,
  TableSelectRow,
  Modal,
} from "@carbon/react";
import { TrashCan } from "@carbon/icons-react";
import confetti from "canvas-confetti";
import "@carbon/styles/css/styles.css";
import "./Tasks.css";

export const Example = () => {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task && priority) {
      setTasks([
        ...tasks,
        { id: tasks.length.toString(), text: task, priority, completed: false },
      ]);
      setTask("");
      setPriority("");
      setIsModalOpen(false);
    }
  };

  const deleteTasks = (selectedRows) => {
    const selectedIds = new Set(selectedRows.map((row) => row.id));
    const newTasks = tasks.filter((task) => !selectedIds.has(task.id));
    setTasks(newTasks);
  };

  const toggleCompletion = (taskId) => {
    const newTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
    const task = tasks.find((task) => task.id === taskId);
    if (task && !task.completed) {
      makeConfetti();
    }
  };

  const makeConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 100,
      origin: { y: 0.6 },
    });
  };

  const headers = [
    { key: "text", header: "Task" },
    { key: "priority", header: "Priority" },
    { key: "completed", header: "Completed" },
  ];

  const rows = tasks.map((task) => ({
    id: task.id,
    text: task.text,
    priority: task.priority,
    completed: (
      <span
        onClick={() => toggleCompletion(task.id)}
        style={{ cursor: "pointer", color: task.completed ? "green" : "red" }}
      >
        {task.completed ? "Yes" : "No"}
      </span>
    ),
  }));

  return (
    <>
      <HeaderContainer
        render={() => (
          <Header aria-label="IBM [ToDo App]">
            <HeaderName href="/" prefix="IBM">
              [Tasks App]
            </HeaderName>
          </Header>
        )}
      />
      <div className="main-content">
        <DataTable rows={rows} headers={headers}>
          {({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getTableProps,
            getTableContainerProps,
            getBatchActionProps,
            getSelectionProps,
            onInputChange,
            selectedRows,
          }) => (
            <TableContainer
              title="Tasks"
              description="A list of tasks"
              {...getTableContainerProps()}
            >
              <TableToolbar>
                <TableBatchActions {...getBatchActionProps()}>
                  <TableBatchAction
                    onClick={() => deleteTasks(selectedRows)}
                    renderIcon={TrashCan}
                  >
                    Delete
                  </TableBatchAction>
                </TableBatchActions>
                <TableToolbarContent>
                  <TableToolbarSearch onChange={onInputChange} />
                  <Button kind="primary" onClick={() => setIsModalOpen(true)}>
                    Add new
                  </Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    <TableSelectAll {...getSelectionProps()} />
                    {headers.map((header) => (
                      <TableHeader
                        key={header.key}
                        {...getHeaderProps({ header })}
                      >
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} {...getRowProps({ row })}>
                      <TableSelectRow {...getSelectionProps({ row })} />
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>

        <Modal
          open={isModalOpen}
          modalHeading="Add a new task"
          primaryButtonText="Add"
          secondaryButtonText="Cancel"
          onRequestSubmit={addTask}
          onRequestClose={() => setIsModalOpen(false)}
        >
          <Form className="task-form">
            <br />
            <FormItem>
              <TextInput
                id="task-input"
                labelText="Task Input"
                placeholder="Enter a new task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </FormItem>
            <br />
            <FormItem>
              <Select
                id="task-priority"
                labelText="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <SelectItem disabled hidden value="" text="Choose a priority" />
                <SelectItemGroup label="Priority">
                  {" "}
                  <SelectItem value="low" text="Low" />
                  <SelectItem value="medium" text="Medium" />
                  <SelectItem value="high" text="High" />
                </SelectItemGroup>
              </Select>
            </FormItem>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Example;
