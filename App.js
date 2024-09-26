import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { supabase } from './supabaseClient';

export default function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [primeiroNome, setPrimeiroNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [idade, setIdade] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [sessao, setSessao] = useState(null);
  const [ehCadastro, setEhCadastro] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessao(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSessao(session);
      if (session) buscarUsuarios();
    });
  }, []);

  const buscarUsuarios = async () => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setUsuarios(data);
    }
  };

  const cadastrarUsuario = async () => {
    if (primeiroNome && sobrenome && idade) {
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{ primeiro_nome: primeiroNome, sobrenome: sobrenome, idade: parseInt(idade, 10) }]);

      if (error) {
        console.error(error);
      } else {
        setPrimeiroNome('');
        setSobrenome('');
        setIdade('');
        buscarUsuarios();
      }
    }
  };

  const entrarComEmail = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    if (error) alert(error.message);
  };

  const cadastrarComEmail = async () => {
    const { error } = await supabase.auth.signUp({ email, password: senha });

    if (error) alert(error.message);
  };

  const sair = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
  };

  if (!sessao) {
    return (
      <View style={estilos.container}>
        <Text style={estilos.titulo}>Bem-vindo ao App de Cadastro de Usuários</Text>
        <TextInput
          style={estilos.entrada}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={estilos.entrada}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        {ehCadastro ? (
          <>
            <TouchableOpacity style={estilos.botao} onPress={cadastrarComEmail}>
              <Text style={estilos.textoBotao}>Cadastrar</Text>
            </TouchableOpacity>
            <Text onPress={() => setEhCadastro(false)} style={estilos.ligacao}>Já tem uma conta? Entrar</Text>
          </>
        ) : (
          <>
            <TouchableOpacity style={estilos.botao} onPress={entrarComEmail}>
              <Text style={estilos.textoBotao}>Entrar</Text>
            </TouchableOpacity>
            <Text onPress={() => setEhCadastro(true)} style={estilos.ligacao}>Não tem uma conta? Cadastre-se</Text>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <TextInput
        style={estilos.entrada}
        placeholder="Primeiro Nome"
        value={primeiroNome}
        onChangeText={setPrimeiroNome}
      />
      <TextInput
        style={estilos.entrada}
        placeholder="Sobrenome"
        value={sobrenome}
        onChangeText={setSobrenome}
      />
      <TextInput
        style={estilos.entrada}
        placeholder="Idade"
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
      />
      <TouchableOpacity style={estilos.botao} onPress={cadastrarUsuario}>
        <Text style={estilos.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={estilos.usuario}>
            <Text style={estilos.textoUsuario}>Nome: {item.primeiro_nome} {item.sobrenome}</Text>
            <Text style={estilos.textoUsuario}>Idade: {item.idade}</Text>
          </View>
        )}
        style={estilos.listaUsuarios}
      />
      <TouchableOpacity style={estilos.botao} onPress={sair}>
        <Text style={estilos.textoBotao}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5', // Roxo claro
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    marginBottom: 20,
    color: '#4A148C', // Roxo escuro
  },
  entrada: {
    width: '100%',
    height: 40,
    borderColor: '#7B1FA2', // Roxo médio
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  botao: {
    backgroundColor: '#7B1FA2', // Roxo médio
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  ligacao: {
    color: '#4A148C', // Roxo escuro
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  usuario: {
    backgroundColor: '#EDE7F6', // Roxo bem claro
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  textoUsuario: {
    color: '#4A148C', // Roxo escuro
  },
  listaUsuarios: {
    marginTop: 20,
    width: '100%',
  },
});
