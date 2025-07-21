<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page isErrorPage="true" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Book Club Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-4 d-flex justify-content-around align-items-center ">
		<nav class="nav nav-pills nav-fill">
		  <a class="nav-link active" aria-current="page" href="#">Active</a>
		  <a class="nav-link" href="#">Much longer nav link</a>
		  <a class="nav-link" href="#">Link</a>
		  <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
		</nav>
	</div>
        <h2 class="container mt-3">Welcome, ${user.firstName}</h2>
		<p>Today is ${today} and you have 0 event(s) today</p>


		
		<div>
