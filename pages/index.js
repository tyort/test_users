import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { Component, createRef } from 'react'
import UserRepository from '../src/repositories/UserRepository'
import { Input, Menu, Card, Icon, Checkbox } from 'semantic-ui-react'
import {users} from '../mock/users'

function Home({users}) {
  const formRef = createRef();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <form ref={formRef} onSubmit={(evt) => {
          evt.preventDefault();
          console.log(new FormData(formRef.current).get(`user-name`));
          formRef.current.reset();
        }}>
          <label htmlFor="user-name">Введите имя полностью или частично</label>
          <input name="user-name"/>
          <button type="submit">Фильтровать</button>
        </form>
        <section className='page-user-cards'>
          <ul className='page-user-cards__list'>
            {
              users.map(({id, fullName, birthYear, profession, friendsCount}) => {
                return (
                  <li key={id}>
                    <Checkbox
                      onChange={(event, data) => {
                        console.log(data.checked)
                      }}
                    />
                    <Card>
                      <Card.Content>
                        <Card.Header>{fullName}</Card.Header>
                        <Card.Meta>
                          <span className='date'>Born in {birthYear}</span>
                        </Card.Meta>
                        <Card.Description>
                          He(She) is {profession}
                        </Card.Description>
                      </Card.Content>
                      <Card.Content extra>
                        <a>
                          <Icon name='user' />
                          {friendsCount} Friends
                        </a>
                      </Card.Content>
                    </Card>
                  </li>
                )
              })
            }
          </ul>
        </section>
      </main>
    </div>
  )
}

export async function getServerSideProps() {
  const userRepository = new UserRepository({users});
  let data = await userRepository.getAllUsers();
  data = JSON.parse(data);

  return {
    props: {
      users: data
    },
  };
}

export default Home;

