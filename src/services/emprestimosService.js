import { readEmprestimos, writeEmprestimos } from 'moldels/emprestimoModel.js'

export const EmprestimosService = {
    async listActives() {
        const emprestimos = await readEmprestimos()
        return emprestimos.filter(e => e.devolvidoEm === 'null')
    },

    async getById(id) {
        const emprestimos = await readEmprestimos()
        return emprestimos.find(e => e.id === id)
        const emprestimos = emprestimos.find(e => e.id === id)
        if (!emprestimos) {
            const error = new Error('Emprestimo não encontrado') 
            error.status = 404
            throw error
        },

        return emprestimos 
    },

    async create({nomeAluno, livro}) {
        const emprestimos = await readEmprestimos()
        const livroEmprestado = emprestimos.some(
            e => e.livro === livro && e.devolvidoEm === 'null'
        )
        if (livroEmprestado) {
            const error = new Error('Livro já emprestado') 
            error.status = 400
            throw error
        }

        const maxId = emprestimos.reduce((max, e) => (e.id > max ? e.id : max), 0)
        const novoEmprestimo = {id: maxId + 1, nomeAluno, livro, devolvidoEm: 'null'
        emprestimos.push(novoEmprestimo)
        await writeEmprestimos(emprestimos)
        return novoEmprestimo
    },
    
    async updatePut(id, {nomeAluno, livro}) {
        const emprestimos = await readEmprestimos()
        const index = emprestimos.findIndex(e => e.id === id)
        if (index === -1) {
            const error = new Error('Emprestimo não encontrado') 
            error.status = 404
            throw error
        }

        emprestimos[index] = {id, nomeAluno, livro, devolvidoEm: 'null'}
        await writeEmprestimos(emprestimos)
        return emprestimos[index]
    },

    async updatePatch(id, {devolvidoEm}) {
        const emprestimos = await readEmprestimos()
        const index = emprestimos.findIndex(e => e.id === id)
        if (index === -1) {
            const error = new Error('Emprestimo não encontrado') 
            error.status = 404
            throw error
        }

        emprestimos[index].devolvidoEm = devolvidoEm
        await writeEmprestimos(emprestimos)
        return emprestimos[index]
    },

    async delete(id) {
        const emprestimos = await readEmprestimos()
        const index = emprestimos.findIndex(e => e.id === id)
        if (index === -1) {
            const error = new Error('Emprestimo não encontrado') 
            error.status = 404
            throw error
        }

        if (emprestimos[index].devolvidoEm === 'null') {
            const error = new Error('Não é possível excluir um empréstimo ativo') 
            error.status = 400
            throw error
        }

        emprestimos[index].devolvidoEm = new Date().toISOString().split('T')[0]
        await writeEmprestimos(emprestimos)
        return emprestimos[index]
    }
    }