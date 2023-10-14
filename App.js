import {
  Box, Button,
  CheckIcon, CheckboxIcon, CheckboxIndicator, Checkbox, CheckboxLabel,
  Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  ButtonText, Fab, FabIcon, FabLabel, AddIcon, GluestackUIProvider, HStack, Heading, Text, VStack, ScrollView, FormControl, FormControlLabel, FormControlLabelText, InputField, Input
} from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { SafeAreaView } from "react-native";
import { useState, useRef, useEffect } from "react";
import { Amplify } from 'aws-amplify';
import awsmobile from './src/aws-exports'
import { API, graphqlOperation } from 'aws-amplify';
import { createTodo, deleteTodo, updateTodo } from './src/graphql/mutations';
import { listTodos } from './src/graphql/queries';

Amplify.configure(awsmobile)


export default function App() {

  const [todos, setTodo] = useState([])
  const [todoName, setTodoName] = useState("")

  const [showModal, setShowModal] = useState(false)
  console.log(showModal)
  const ref = useRef(null)

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      const todos = todoData.data.listTodos.items;
      setTodo(todos);
    } catch (err) {
      console.log('error fetching todos');
    }
  }



  const addTodo = () => {
    const newTodo =  { 
      title: todoName,
    completed: false}
    setTodo([...todos, newTodo])
    API.graphql(graphqlOperation(createTodo, {input: newTodo}));
    setShowModal(false)



  }

  const openModal = () => {
    setShowModal(true)
  }

  const deeteTodo =  async(_id) => {
   
    const todoDetails = {
      id: _id,
    };
    console.log(todoDetails)
    const tempData = todos.filter(item => item.id !== _id); // this will remove the item which matches the id
    setTodo(tempData);
    await API.graphql(graphqlOperation(deleteTodo, { input: { id : _id } }))
  }

  const markasComplete = async (todo) => {
    const tempTodos = [...todos];
    const newVal = !todo.completed
    console.log(newVal)
    tempTodos.map(i => {
      if(i.id == todo.id){
        i.completed = !i.completed
      }
    })
    setTodo(tempTodos);
    // console.log(tempTodos[id])
    const tempTodo = {
      id : todo.id,
      completed : newVal
    }
    await API.graphql(graphqlOperation(updateTodo, { input : tempTodo}))
  }

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
                        <Checkbox isChecked={todo.completed ? true : false} size="md" isInvalid={false} accessibilityLabel="click" isDisabled={false} onPress={() => markasComplete(todo)}>
                          <CheckboxIndicator mr="$2">
                            <CheckboxIcon as={CheckIcon} />
                          </CheckboxIndicator>
                        </Checkbox>
                        <Text size="xl" textDecorationLine={todo.completed ? "line-through" : "none"}>{todo.title}</Text>
                      </HStack>
                    </Box>
                    <Button bgColor="white" onPress={() => deeteTodo(todo.id)}>
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
                  <InputField type="text" placeholder="type here ..." onChangeText={setTodoName} />
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