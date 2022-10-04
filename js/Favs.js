import { GitFav } from "./GitFav.js"

export class Favs {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load(){
    this.users = JSON.parse(localStorage.getItem('@gitfav:')) || []
}

  save() {
    localStorage.setItem('@gitfav:', JSON.stringify(this.users))
  }
  async add(username){
    try{
      const userExists = this.users.find(entry => entry.login.toUpperCase() === username.toUpperCase())

      if(userExists) {
        throw new Error ('Usuário já cadastrado!')
      }
      const user = await GitFav.search(username)
      
      if (user.login === undefined){
        throw new Error('usuário inexistente.')
      }

      this.users = [user, ...this.users]
      this.update()
      this.save()

    } catch (error) {
      alert(error.message)
    }

  }

  delete(user){
    const filterUsers = this.users.
    filter(entry => entry.login !== user.login)

    this.users = filterUsers

    this.update()
    this.save()
    }
}


//visualização de dados
export class FavoritesView extends Favs{
  constructor(root){
    super(root)
    
    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  onadd(){
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
        const { value } = this.root.querySelector('.search input')

        this.add(value)
    }
  }
  
  update(){
    this.removeAllTr()

    this.users.forEach(user => {
      const row = this.createTR()
        
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem do usuário`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Remover usuário?')
        if (isOk) {
          this.delete(user)
        }
       
      }
      this.tbody.append(row)
    })
  }

  createTR(){
    const tr = document.createElement('tr')
    tr.innerHTML = `<tr>
    <td class="user">
        <img src="https://github.com/davidayres3.png" alt="">
        <a href="https://github.com/davidayres3" target="_blank"> 
            <p>David Ayres</p>
            <span>Davidayres3</span>
        </a>
    </td>
    <td class="repositories">
        321
    </td>
    <td class="followers">
        222
    </td>
    <td>
        <button class="remove">Remover</button>
    </td>
  </tr>
  `
  return tr
  }

  removeAllTr(){

    this.tbody.querySelectorAll('tr')
    .forEach((tr) =>{
      tr.remove()
    })
  }
}