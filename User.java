public class User {
    private String email;
    private String password;
    private String username;
    private String userID;

    // default constructor
    public User(String email, String password) {
        this.email = email;
        this.password = password;
        this.username = email;
        // assign a unique userID to a user
    }

    // another constructor
    public User(String email, String password, String username) {
        this.email = email;
        this.password = password;
        this.username = username;
        // assign a unique userID to a user
    }

    public boolean createPortfolio() {
        // return true if portfolio creation is successful
        return true;
    }

}