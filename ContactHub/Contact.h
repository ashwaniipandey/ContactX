#ifndef CONTACT_H
#define CONTACT_H

#include <iostream>
#include <string>

using namespace std;

class Contact
{
private:
    string name;
    string phone;
    string email;
    string address;
    bool favorite;
    string dateAdded;

public:
    // Constructors
    Contact();

    Contact(string name,
            string phone,
            string email,
            string address,
            bool favorite,
            string dateAdded);

    // Getters
    string getName() const;
    string getPhone() const;
    string getEmail() const;
    string getAddress() const;
    bool getFavorite() const;
    string getDateAdded() const;

    // Setters
    void setName(string name);
    void setPhone(string phone);
    void setEmail(string email);
    void setAddress(string address);
    void setFavorite(bool favorite);
    void setDateAdded(string dateAdded);

    // Display Contact
    void display() const;
};

#endif