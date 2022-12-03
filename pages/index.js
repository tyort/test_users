import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { Component, createRef, useEffect, useState } from 'react'
import { Input, Menu, Card, Icon, Checkbox } from 'semantic-ui-react'
import { Reorder } from 'framer-motion';
import {useLocalStorage} from '../lib/useLocalStorage';

function Home({users}) {
  const formRef = createRef();
  const [modifiedCheckboxes, setModifiedCheckboxes] = useState([]);
  const [isMarkedShowOnly, setMarkedShowOnly] = useState(false);
  const [modifiedUsers, setModifiedUsers] = useState(null);
  console.log(modifiedUsers);
  const currentUsers = modifiedUsers || users;
  const kfkkek = currentUsers.map((user) => user.id)
  const [order, setOrder] = useLocalStorage(kfkkek, 'order');
  console.log(order);


  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const endpoint = 'http://localhost:3002/filter';
    const searchData = evt.target['user-name'].value;
    let userIdForVisual = users.map((user) => user.id);

    if (searchData !== '') {
      const regExpName = new RegExp(searchData, 'gmi');
      userIdForVisual = users
        .filter((user) => {
          return !!user.fullName.match(regExpName);
        })
        .map((user) => user.id);
    }

    const data = {
      isMarkedShowOnly,
      modifiedCheckboxes,
      userIdForVisual
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }
    const response = await fetch(endpoint, options)
    const result = await response.json()
    setModifiedUsers(result)
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <form ref={formRef} onSubmit={handleSubmit}>
          <label htmlFor="user-name">Введите имя полностью или частично</label>
          <input style={{marginLeft: '0.5em'}} name="user-name"/>
          <button style={{marginLeft: '3em'}} type="submit">Фильтровать</button>
        </form>
        <Checkbox
          onChange={(evt, data) => setMarkedShowOnly(data.checked)}
          style={{marginTop: '2em'}}
          label='Показать только отмеченные'
        />
        <section className='page-user-cards'>
          <Reorder.Group
            className='page-user-cards__list'
            axys="y"
            values={currentUsers}
            onReorder={setModifiedUsers}
          >
            {
              currentUsers.map((user) => {
                const {isVisible, id, isChecked, fullName, birthYear, profession, friendsCount} = user;
                return (
                  isVisible && <Reorder.Item value={user} key={id}>
                    <Checkbox
                      defaultChecked={isChecked}
                      id={id}
                      onChange={(event, data) => {
                        setModifiedCheckboxes([...modifiedCheckboxes, [data.id, data.checked]])
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
                  </Reorder.Item>
                )
              })
            }
          </Reorder.Group>
        </section>
      </main>
    </div>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:3002/`)
  const data = await res.json()

  return {
    props: {
      users: data
    },
  };
}

export default Home;

