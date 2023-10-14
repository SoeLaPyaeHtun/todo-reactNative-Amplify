import {
  Box, Button,
  CheckIcon, CheckboxIcon, CheckboxIndicator, Checkbox, CheckboxLabel,
  Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  ButtonText, Fab, FabIcon, FabLabel, AddIcon, GluestackUIProvider, HStack, Heading, Text, VStack, ScrollView, FormControl, FormControlLabel, FormControlLabelText, InputField, Input
} from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { SafeAreaView } from "react-native";
import { useState, useRef } from "react";

export default function App() {
  const data = [
    {
      id: 1,
      title: "title 1",
      completed: false
    },
    {
      id: 2,
      title: "title 2",
      completed: false
    },
    {
      id: 3,
      title: "title 3",
      completed: false
    },
    {
      id: 4,
      title: "title 4",
      completed: false
    },
    {
      id: 5,
      title: "title 5",
      completed: false
    }
  ]

  const [todos, setTodo] = useState(data)
  const [todoName , setTodoName] = useState("")

  const [showModal, setShowModal] = useState(false)
  console.log(showModal)
  const ref = useRef(null)

  const addTodo = () => {
    setTodo([...todos, {
      id: todos[todos.length - 1].id + 1,
      title: todoName,
      completed: false
    }])
    setShowModal(false)

    
   
  }

  const openModal = () => {
    setShowModal(true)
  }

  const deleteTodo = (id) => {
    const tempData = todos.filter(item => item.id !== id); // this will remove the item which matches the id
    setTodo(tempData);
  }

  const markasComplete = (id) => {
    const tempTodos = [...todos];
    tempTodos[id].completed = !tempTodos[id].completed
    setTodo(tempTodos);
  }


console.log(todoName)
  return (
    <SafeAreaView>
      <GluestackUIProvider config={config}>
        <Heading p="$4" size="4xl">Todo List</Heading>
        <Box>
          <VStack>
            <ScrollView h="90%">
              {
                todos.map((todo, index) => (
                  <HStack key={index} p="$3">
                    <Box w="80%">
                      <HStack>
                        <Checkbox size="md" isInvalid={false} accessibilityLabel="click" isDisabled={false} onPress={() => markasComplete(index)}>
                          <CheckboxIndicator mr="$2">
                            <CheckboxIcon as={CheckIcon} />
                          </CheckboxIndicator>
                        </Checkbox>
                        <Text size="xl" textDecorationLine={todo.completed ? "line-through" : "none"}>{todo.title}</Text>
                      </HStack>
                    </Box>
                    <Button bgColor="white" onPress={() => deleteTodo(todo.id)}>
                      <ButtonText color="red">Delete</ButtonText>
                    </Button>
                  </HStack>
                ))
              }
              <HStack p="$3">
                <Text></Text>
              </HStack>
              <HStack p="$3">
                <Text></Text>
              </HStack>
            </ScrollView>

            {/* <Button w="90%" onPress={addTodo}>
                <ButtonText>add todo</ButtonText>
              </Button> */}
            <Fab
              size="md"
              onPress={openModal}
              placement="bottom right"
              isHovered={false}
              isDisabled={false}
              isPressed={false}
            >
              <FabIcon as={AddIcon} mr="$1" />
              <FabLabel>Add Todo</FabLabel>
            </Fab>

          </VStack>
        </Box>

        <Modal
         avoidKeyboard={true}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
          }}
          finalFocusRef={ref}
        >
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Heading size="xl">Todo Item</Heading>
              <ModalCloseButton>

              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
            <FormControl
    size="lg"
    isDisabled={false}
    isInvalid={false}
    isReadOnly={false}
    isRequired={false}
  >
     <FormControlLabel mb="$1">
      <FormControlLabelText>Todo Item Name</FormControlLabelText>
    </FormControlLabel>
    <Input>
      <InputField type="text" placeholder="type here ..." onChangeText={setTodoName}/>
    </Input>
  </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                size="sm"
                action="secondary"
                mr="$3"
                onPress={() => {
                  setShowModal(false)
                }}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                size="sm"
                action="positive"
                borderWidth="$0"
                onPress={
                  addTodo
                }
              >
                <ButtonText>Add</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

      </GluestackUIProvider>
    </SafeAreaView>
  );
}