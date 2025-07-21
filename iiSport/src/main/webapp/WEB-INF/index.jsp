<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ page isErrorPage="true" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Login and Registration</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

<div class="container mt-5">
    <h1 class="text-center mb-3 text-warning">iSport</h1>
    <h6 class="text-center mb-5">Free Pickup Game Finder and Organizer</h6>

    <div class="row justify-content-center">
        <!-- Registration Form -->
        <div class="col-md-5">
            <div class="mb-4">
                <h3>New User Registration</h3>
                <form:form action="/register" method="post" modelAttribute="newUser" cssClass="needs-validation">
                    <div class="mb-3">
                        <form:label path="firstName" class="form-label">First Name</form:label>
                        <form:input path="firstName" class="form-control"/>
                        <form:errors path="firstName" class="text-danger"/>
                    </div>
                    <div class="mb-3">
                        <form:label path="lastName" class="form-label">Last Name</form:label>
                        <form:input path="lastName" class="form-control"/>
                        <form:errors path="lastName" class="text-danger"/>
                    </div>
                    <div class="mb-3">
                        <form:label path="email" class="form-label">Email</form:label>
                        <form:input path="email" class="form-control"/>
                        <form:errors path="email" class="text-danger"/>
                    </div>
                    <div class="mb-3">
                        <form:label path="password" class="form-label">Password</form:label>
                        <form:password path="password" class="form-control"/>
                        <form:errors path="password" class="text-danger"/>
                    </div>
                    <div class="mb-3">
                        <form:label path="birthDate" class="form-label">Date of Birth</form:label>
                        <form:input path="birthDate" type="date" class="form-control"/>
                        <form:errors path="birthDate" class="text-danger"/>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Register</button>
                </form:form>
            </div>
        </div>

        <!-- Login Form -->
        <div class="col-md-5">
            <h3>Log In</h3>
            <form:form action="/login" method="post" modelAttribute="newLogin">
                <div class="mb-3">
                    <form:label path="email" class="form-label">Email</form:label>
                    <form:input path="email" class="form-control"/>
                    <form:errors path="email" class="text-danger"/>
                </div>
                <div class="mb-3">
                    <form:label path="password" class="form-label">Password</form:label>
                    <form:password path="password" class="form-control"/>
                    <form:errors path="password" class="text-danger"/>
                </div>
                <button type="submit" class="btn btn-success w-100">Login</button>
            </form:form>
        </div>
    </div>
</div>

</body>
</html>
