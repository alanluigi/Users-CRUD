import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Main from '../template/main'

const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de usuários: Incluir, Listar, Alterar e Excluir'
}

const baseUrl = 'http://192.168.1.3:3001/users'


export default function UserCrud() {

    const [users, setUsers] = useState({ name: '', email: '' })
    const [list, setList] = useState([])



    useEffect(() => {
        axios(baseUrl).then(resp => {
            setList(resp.data)
        })
    },[])

    function clear() {
        setUsers({ name: '', email: '' })
    }

    function save() {
        const user = users
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        axios[method](url, user)
            .then(resp => {
                const list = getUpdatedList(resp.data)
                setUsers({ name: '', email: '' })
                setList(list)
            })
    }

    function getUpdatedList(user, add = true) {
        const showList = list.filter(u => u.id !== user.id)
        if(add) showList.unshift(user)
        return showList
    }

    function updateField(event) {
        const user = { ...users }
        user[event.target.name] = event.target.value
        setUsers(user)
    }

    
    function renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome</label>
                            <input autoComplete="off" type="text" className="form-control"
                                name="name"
                                value={users.name}
                                onChange={e => updateField(e)}
                                placeholder="Digite o nome..."
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="text" className="form-control"
                                name="email"
                                value={users.email}
                                onChange={e => updateField(e)}
                                placeholder="Digite o email..."
                            />
                        </div>
                    </div>
                </div>
                <hr/>

                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => save(e)}>
                            Salvar
                        </button>
                        <button className="btn btn-secondary ml-2"
                            onClick={e => clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    function load(user) {
        setUsers(user)
    }

    function remove(user) {
        console.log(user)
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = getUpdatedList(user, false)
            setList(list)
        })
    }

    function renderTable() {
        return (
            <div className="table-responsive-sm overflow-hidden">
                <table className="table mt-4">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderRows()}
                    </tbody>
                </table>
            </div>
        )
    }

    function renderRows() {
        return list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <button className="btn btn-warning ml-2" title="Editar"
                            onClick={() => load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2" title="Excluir"
                            onClick={() => remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }
    
    return (
        <Main {...headerProps}>
            {renderForm()}
            {renderTable()}
        </Main>
    )
}