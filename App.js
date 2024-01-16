import { TextInput, Button, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';

export default function App() {

  const [reply, setReply] = useState("")
  const [messages2, setMessages2] = useState([])
  const [text, setText] = useState("")
  const [currentQ, setCurrentQ] = useState(null)

  function getJoke(){
    setCurrentQ({ "role": "user", "content": text })   
  }

  useEffect(() => {
    if (currentQ) {
        const updatedMessages = [...messages2, currentQ];
        queryOpenAIChat(updatedMessages).then(response => {
          const rep = response.choices[0].message;
          // Update with the response from OpenAI
          setMessages2([...messages2, currentQ, rep]) // important: Add both objects, and in order
          console.log("reply ", rep.content)
          setReply(rep.content)
        });
    }
  }, [currentQ]);
  
  useEffect(()=>{
    console.log("messages array ", messages2)
  }, [messages2])

  async function queryOpenAIChat(updatedMessages){
      const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
      const headers = {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json'
      };
      const data = {
          model: "gpt-4-1106-preview",  // was gpt-3.5-turbo, gpt-4-1106-preview, gpt-4-vision-preview
          messages: updatedMessages
      };
      try {
          const response = await axios.post(OPENAI_API_URL, data, { headers });
          return response.data;
      } catch (error) {
          console.error('Error querying OpenAI:', error);
          return null;
      }
  };

  
  return (
    <View style={styles.container}>
      <TextInput style={styles.textInput} 
         onChangeText={(txt) => setText(txt)} placeholder='type here' />
      <Button title='Get Joke' onPress={getJoke} />
      <Text>{reply}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button1:{
    flex:1,
    backgroundColor: '#73a'
  },
  container: {
    flex: 1,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput:{
    backgroundColor:'lightblue',
    minWidth: 200
    }
});
