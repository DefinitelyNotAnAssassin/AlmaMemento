<template>
<div class="profile-container">
    <h1 class="template-title">Profile</h1>
    <div class="user-profile">
        <div>
            <img width="200" height="200" src="@/assets/images/user.png" alt="profile-picture"/>
            <h3 style="text-align: center;">Administrator</h3>
        </div>
        <div class="profile-details">
            <h1>Lorem Ipsum</h1>
            <a>lorem_ipsum@gmail.com</a>
            <div style="display: flex; align-items: center;">
                <h2 style="margin-right: 10px;">Enchanted Kingdom</h2>
                <img width="25" height="25" src="https://img.icons8.com/ios/100/create-new.png" alt="create-new"/>
            </div>
        </div>
    </div>
    <div class="profile-info">
        <div>
            <label for="adminId">Admin ID:</label>
            <input type="text" id="adminId" name="adminId">
        </div>

        <div>
            <label for="birthday">Birthday:</label>
            <input type="date" id="birthday" name="birthday">
        </div>

        <div>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name">
        </div>

        <div>
            <label for="phone">Phone:</label>
            <input type="tel" id="phone" name="phone">
        </div>

        <div>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email">
        </div>

        <div>
            <label for="address">Address:</label>
            <input type="text" id="address" name="address">
        </div>

        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password">
        </div>

        <div>
            <label for="year">Year of Administratorship:</label>
            <input type="number" id="year" name="year">
        </div>
    </div>
</div>
</template>

<style>
.profile-container {
    width: 100%;
    margin: 24px;
    overflow: auto;
}
.template-title {
    margin: 10px;
}
.user-profile {
    margin: 10px;
    display: flex;
}
.profile-details {
    margin-left: 24px;
}
.profile-details h1 {
    font-size: 4rem;
}
.profile-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  max-width: 600px;
  margin: 0 auto;
}

.profile-info div {
  display: flex;
  flex-direction: column;
}

.profile-info input {
  padding: 10px;
  font-size: 14px;
}

.profile-info input[type="password"] {
  font-family: 'password';
}
</style>