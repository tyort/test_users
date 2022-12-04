import Image from 'next/image';
import React, { Component, createRef, useEffect, useState } from 'react';
import axios from 'axios';
import { Input, Menu, Card, Icon, Checkbox } from 'semantic-ui-react';
import { Reorder } from 'framer-motion';
import styles from '../styles/Home.module.css';
import { useLocalStorage } from '../lib/useLocalStorage';

function Home() {
  const formRef = createRef();
  const [users, setUsers] = useState([]);
  const [modifiedCheckboxes, setModifiedCheckboxes] = useState([]);
  const [isMarkedShowOnly, setMarkedShowOnly] = useState(false);

  const [currentCount, setCurrentCount] = useState(8);
  const [fetching, setFetching] = useState(true); // true- подгружаем данные

  console.log(users);
  const currentUsers = users;
  const initialOrder = currentUsers.map((user) => user !== null && user.id);

  useEffect(() => {
    if (fetching) {
      axios
        .get(`http://localhost:3002/?limit=${currentCount}`)
        .then((response) => {
          setUsers(response.data);
          setCurrentCount((prevState) => prevState + 1);
        })
        .finally(() => setFetching(false));
    }
  }, [fetching]);

  const scrollhandler = (evt) => {
    if (
      evt.target.documentElement.scrollHeight -
        evt.target.documentElement.scrollTop -
        window.innerHeight <
      100
    ) {
      setFetching(true);
    }
    // console.log(evt.target.documentElement.scrollHeight); // общая высота страницы с учетом скролла
    // console.log(evt.target.documentElement.scrollTop); // текущее положение скролла
    // console.log(window.innerHeight); // высота видимой области страницы
  };

  useEffect(() => {
    document.addEventListener('scroll', scrollhandler);
    return function () {
      document.removeEventListener('scroll', scrollhandler);
    };
  }, []);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const endpoint = 'http://localhost:3002/filter';
    const searchData = evt.target['user-name'].value;
    let userIdForVisual = users.map((user) => user.id);

    if (searchData !== '') {
      const regExpName = new RegExp(searchData, 'gmi');
      userIdForVisual = users
        .filter((user) => !!user.fullName.match(regExpName))
        .map((user) => user.id);
    }

    const data = {
      isMarkedShowOnly,
      modifiedCheckboxes,
      userIdForVisual,
      order: initialOrder,
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(endpoint, options);
    const result = await response.json();
    setUsers(result);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <form ref={formRef} onSubmit={handleSubmit}>
          <label htmlFor='user-name'>Введите имя полностью или частично</label>
          <input style={{ marginLeft: '0.5em' }} name='user-name' />
          <button style={{ marginLeft: '3em' }} type='submit'>
            Фильтровать
          </button>
        </form>
        <Checkbox
          onChange={(evt, data) => setMarkedShowOnly(data.checked)}
          style={{ marginTop: '2em' }}
          label='Показать только отмеченные'
        />
        <section className='page-user-cards'>
          <Reorder.Group
            className='page-user-cards__list'
            axys='y'
            values={currentUsers}
            onReorder={setUsers}
          >
            {currentUsers.map((user) => {
              if (user === null) {
                return '';
              }
              const {
                isVisible,
                id,
                isChecked,
                fullName,
                birthYear,
                profession,
                friendsCount,
              } = user;
              return (
                isVisible && (
                  <Reorder.Item value={user} key={id}>
                    <Checkbox
                      defaultChecked={isChecked}
                      id={id}
                      onChange={(event, data) => {
                        setModifiedCheckboxes([
                          ...modifiedCheckboxes,
                          [data.id, data.checked],
                        ]);
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
              );
            })}
          </Reorder.Group>
        </section>
      </main>
    </div>
  );
}

export default Home;
