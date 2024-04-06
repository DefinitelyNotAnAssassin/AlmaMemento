<template>
    <div>
      <nav class="navbar">
        <div class="navbar-brand">
          <a class="navbar-item" href="#">
          </a>
        </div>
        <div class="navbar-end">
          <a class="navbar-item" @click="toggleNotifications">
            <span class="icon">
              <i class="fas fa-bell"></i>
            </span>
          </a>
          <a class="navbar-item" @click="toggleProfile">
            <span class="icon">
              <i class="fas fa-user"></i>
            </span>
          </a>
        </div>
      </nav>
      <div class="main">
        <aside class="sidebar">
          <img src="../assets/images/logo.png" alt="Logo">
    <ul>
      <li v-for="(item, index) in sidebarItems" :key="index">
        <a @click="selectItem(index)">
          {{ item }}
          <span v-if="item === 'Item 3' || item === 'Item 4' || item === 'Item 5'" class="dropdown-arrow">▼</span>
        </a>
        <ul v-if="dropdownItemsVisible[item]">
          <li v-for="(dropdownItem, dropdownIndex) in dropdownItems" :key="dropdownIndex">
            <button @click="handleDropdownClick(dropdownItem)">{{ dropdownItem }}</button>
          </li>
        </ul>
      </li>
    </ul>
          <button @click="logout" class="logout-button"><i class="fas fa-power-off"></i>  Logout</button>
        </aside>
        <div class="cards-container">
          <h1>Welcome Admin!</h1>
          <div class="card-one">
            <div class="top-content">
              <img width="100" height="100" src="https://img.icons8.com/dusk/100/students.png" alt="students"/>
              <h1>13</h1>
            </div>
            <div class="bottom-content">
              <h3>Total Alumni</h3>
              <i class="fa fa-arrow-circle-right" aria-hidden="true"></i>
            </div>
          </div>
          <div class="card-two">
            <div class="top-content">
              <img width="100" height="100" src="https://img.icons8.com/dusk/64/contact-card.png" alt="contact-card"/>
              <h1>4</h1>
            </div>
            <div class="bottom-content">
              <h3>Contact Support</h3>
              <i class="fa fa-arrow-circle-right" aria-hidden="true"></i>
            </div>
          </div>
          <div class="card-three">
            <div class="top-content">
              <img width="100" height="100" src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/100/external-courses-recruitment-agency-flaticons-lineal-color-flat-icons-2.png" alt="external-courses-recruitment-agency-flaticons-lineal-color-flat-icons-2"/>
              <h1>7</h1>
            </div>
            <div class="bottom-content">
              <h3>Courses</h3>
              <i class="fas fa-circle-right"></i>
              <i class="fa fa-arrow-circle-right" aria-hidden="true"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div></div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { db } from '../firebase/index.js'
  import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'

  const errMsg = ref("")
  const router = useRouter()

  export default {
    data() {
      return {
        notificationsVisible: false,
        profileVisible: false,
        sidebarItems: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'],
        dropdownItems: ['Dropdown Item 1', 'Dropdown Item 2', 'Dropdown Item 3'],
        dropdownItemsVisible: {
        'Item 3': false,
        'Item 4': false,
        'Item 5': false
        }   
      };
    },
    methods: {
      toggleNotifications() {
        this.notificationsVisible = !this.notificationsVisible;
      },
      toggleProfile() {
        this.profileVisible = !this.profileVisible;
      },
      selectItem(index) {
        const selectedItem = this.sidebarItems[index];
        switch (selectedItem) {
            case 'Item 1':
                this.$router.push('/item1');
                break;
            case 'Item 2':
                this.$router.push('/item2');
                break;
            case 'Item 3':
            case 'Item 4':
            case 'Item 5':
                this.toggleDropdown(selectedItem);
                break;
            default:
                break;
        }
      },
      toggleDropdown(item) {
        this.dropdownItemsVisible[item] = !this.dropdownItemsVisible[item];
        },
        handleDropdownClick(dropdownItem) {
    console.log('Clicked dropdown item:', dropdownItem);
        },
      async logout() {
        try {
          console.log("Logging out...")

          const q = collection(db, "users")
          const querySnapshot = await getDocs(q)
          const user = querySnapshot.docs.find(doc => doc.data().loggedIn === true)

          if (user) {
            console.log("User found:", user.data())

            await updateDoc(doc(db, 'users', user.id), {
              loggedIn: false
            });

            router.push({ name: 'login' })
            console.log("Current URL:", window.location.href);
          } else {
            errMsg.value = "No logged in user found"
          }
        } catch (error) {
          console.error("Error:", error.message)
          errMsg.value = "An error occurred"
        }
      }
    }
  };
</script>

  