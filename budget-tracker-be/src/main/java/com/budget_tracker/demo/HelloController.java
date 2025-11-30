package com.budget_tracker.demo;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200") // allow Angular dev server
public class HelloController {

    @GetMapping("/hello")
    public String sayHello() {
        return "I love you my beautiful wife 🥺❤️";
    }
}
