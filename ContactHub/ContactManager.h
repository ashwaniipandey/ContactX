#ifndef CONTACTMANAGER_H
#define CONTACTMANAGER_H

#include <vector>
#include "Contact.h"

using namespace std;

class ContactManager
{
private:
    vector<Contact> contacts;

public:
    ContactManager();

    // CRUD
    void addContact(Contact contact);
    void viewContacts();

    // Search
    void searchByName(string name);
    void searchByPhone(string phone);
    void searchByEmail(string email);

    // Update/Delete
    bool updateContact(string oldPhone, Contact updatedContact);
    bool deleteContact(string phone);

    // Sorting
    void sortByName();
    void sortByPhone();

    // Favorites
    void viewFavoriteContacts();

    // Statistics
    void showStatistics();

    // File Handling
    void saveToFile();
    void loadFromFile();

    bool isValidPhone(string phone);
    bool isValidEmail(string email);
    bool isDuplicatePhone(string phone);
};

#endif