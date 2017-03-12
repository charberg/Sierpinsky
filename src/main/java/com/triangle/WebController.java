package com.triangle;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

/**
 * Created by danielsauve on 2017-02-16.
 */
@Controller
public class WebController {

    @Autowired
    public WebController() {
    }

    @GetMapping("/page")
    public String greetingForm(Model model) {
        return "page";
    }


}