package gr.uom.strategicplanning.controllers;

import gr.uom.strategicplanning.controllers.responses.implementations.UserResponse;
import gr.uom.strategicplanning.models.users.User;
import gr.uom.strategicplanning.services.ProjectService;
import gr.uom.strategicplanning.services.UserPrivilegedService;
import gr.uom.strategicplanning.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;


@Controller
@RequestMapping("/api/admin")
public class UserPrivilegedController {

    @Autowired
    private UserPrivilegedService userPrivilegedService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProjectService projectService;

    @PutMapping("/verify")
    ResponseEntity<String> verifyUser(@RequestParam String email){
        try {
            User verifiedUser = userPrivilegedService.verifyUser(email);
            return ResponseEntity.ok("User with email " + verifiedUser.getEmail() + " is verified");
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
    @PutMapping("/authorize")
    ResponseEntity<String> givePrivilegeToUser(@RequestParam String email){
        try {
            User userWithPrivilege = userPrivilegedService.givePrivilegeToUser(email);
            return ResponseEntity.ok("User with email " + userWithPrivilege.getEmail() + " is privileged");
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @PutMapping("/project/{id}/authorize")
    ResponseEntity<String> authorizeProjectForAnalysis(@PathVariable Long id){
        try {
            projectService.authorizeProjectForAnalysis(id);

            return ResponseEntity.ok("Project with id " + id + " is authorized for analysis");
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //not authorize project
    @PutMapping("/project/{id}/unauthorize")
    ResponseEntity<String> unauthorizeProjectForAnalysis(@PathVariable Long id){
        try {
            projectService.unauthorizeProjectForAnalysis(id);
            return ResponseEntity.ok("Project with id " + id + " is unauthorized for analysis");
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/user/organization/{id}")
    List<UserResponse> getUsersByOrganizationId(@PathVariable Long id){
        Optional<List<UserResponse>> userResponses = userService.getUsersByOrganizationId(id);

        if(userResponses.isEmpty())
            throw new RuntimeException("No users found");

        return userResponses.get();
    }

    @DeleteMapping("/user/delete/{id}")
    ResponseEntity<Map> deleteUser(@PathVariable Long id){
        try {
            userService.deleteUser(id);
            Map<String, String> response = Map.of("message", "User with id " + id + " is deleted");
            return ResponseEntity.ok()
                    .body(response);
        } catch (ResponseStatusException ex) {
            Map<String, String> response = Map.of("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PutMapping("/user/update/{id}")
    ResponseEntity<String> updateUser(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ){
        try {
            userService.updateUser(id, body);
            return ResponseEntity.ok("User with id " + id + " is updated");
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}
