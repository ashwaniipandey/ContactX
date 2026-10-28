#include "ContactManager.h"

#include <algorithm>
#include <cctype>

#include <fstream>
#include <sstream>

string toLowerCase(string text)
{
    for (char &ch : text)
    {
        ch = tolower(ch);
    }
    return text;
}

ContactManager::ContactManager(){

}


void ContactManager::addContact(Contact contact)
{
    contacts.push_back(contact);
}

void ContactManager::viewContacts()
{
    if (contacts.empty())
    {
        cout << "\nNo Contacts Found!\n";
        return;
    }

    cout << "\n========== CONTACT LIST ==========\n";

    for (Contact contact : contacts)
    {
        contact.display();
    }
}


void ContactManager::searchByName(string name)
{
    bool found = false;

    name = toLowerCase(name);

    for (const Contact &contact : contacts)
    {
        if (toLowerCase(contact.getName()) == name)
        {   
            cout<<"\nCONTACT FOUND: \n";
            contact.display();
            
            found = true;
        }
    }

    if (!found)
    {
        cout << "\nContact not found!\n";
    }
}


void ContactManager::searchByPhone(string phone)
{
    bool found = false;

    for (const Contact &contact : contacts)
    {
        if (contact.getPhone() == phone)
        {
            contact.display();
            found = true;
        }
    }

    if (!found)
    {
        cout << "\nContact not found!\n";
    }
}


void ContactManager::searchByEmail(string email)
{
    bool found = false;

    email = toLowerCase(email);

    for (const Contact &contact : contacts)
    {
        if (toLowerCase(contact.getEmail()) == email)
        {
            contact.display();
            found = true;
        }
    }

    if (!found)
    {
        cout << "\nContact not found!\n";
    }
}


bool ContactManager::updateContact(string oldPhone, Contact updatedContact)
{
    for (Contact &contact : contacts)
    {
        if (contact.getPhone() == oldPhone)
        {
            contact = updatedContact;
            return true;
        }
    }

    return false;
}


bool ContactManager::deleteContact(string phone)
{
    for (int i = 0; i < contacts.size(); i++)
    {
        if (contacts[i].getPhone() == phone)
        {
            contacts.erase(contacts.begin() + i);
            return true;
        }
    }

    return false;
}


void ContactManager::sortByName()
{
    sort(contacts.begin(), contacts.end(),
         [](const Contact &a, const Contact &b)
         {
             return a.getName() < b.getName();
         });

    cout << "\n✅ Contacts Sorted By Name Successfully!\n";
}


void ContactManager::sortByPhone()
{
    sort(contacts.begin(), contacts.end(),
         [](const Contact &a, const Contact &b)
         {
             return a.getPhone() < b.getPhone();
         });

    cout << "\n✅ Contacts Sorted By Phone Successfully!\n";
}


void ContactManager::viewFavoriteContacts()
{
    bool found = false;

    for (const Contact &contact : contacts)
    {
        if (contact.getFavorite())
        {
            contact.display();
            found = true;
        }
    }

    if (!found)
    {
        cout << "\nNo Favorite Contacts Found!\n";
    }
}


void ContactManager::showStatistics()
{
    int favoriteCount = 0;

    for (const Contact &contact : contacts)
    {
        if (contact.getFavorite())
            favoriteCount++;
    }

    cout << "\n========== STATISTICS ==========\n";
    cout << "Total Contacts    : " << contacts.size() << endl;
    cout << "Favorite Contacts : " << favoriteCount << endl;
}


void ContactManager::saveToFile()
{
    ofstream file("contacts.txt");

    if (!file)
    {
        cout << "Error opening file!\n";
        return;
    }

    for (const Contact &contact : contacts)
    {
        file << contact.getName() << "|"
             << contact.getPhone() << "|"
             << contact.getEmail() << "|"
             << contact.getAddress() << "|"
             << contact.getFavorite() << "|"
             << contact.getDateAdded() << "\n";
    }

    file.close();
}


void ContactManager::loadFromFile()
{
    ifstream file("contacts.txt");

    if (!file)
    {
        return;
    }

    contacts.clear();

    string line;

    while (getline(file, line))
    {
        stringstream ss(line);

        string name, phone, email, address, favoriteStr, dateAdded;

        getline(ss, name, '|');
        getline(ss, phone, '|');
        getline(ss, email, '|');
        getline(ss, address, '|');
        getline(ss, favoriteStr, '|');
        getline(ss, dateAdded);

        bool favorite = (favoriteStr == "1");

        Contact contact(
            name,
            phone,
            email,
            address,
            favorite,
            dateAdded
        );

        contacts.push_back(contact);
    }

    file.close();
}


bool ContactManager::isValidPhone(string phone)
{
    if (phone.length() != 10)
        return false;

    for (char ch : phone)
    {
        if (!isdigit(ch))
            return false;
    }

    return true;
}


bool ContactManager::isValidEmail(string email)
{
    size_t atPos = email.find('@');
    size_t dotPos = email.find('.', atPos);

    if (atPos == string::npos)
        return false;

    if (dotPos == string::npos)
        return false;

    return true;
}


bool ContactManager::isDuplicatePhone(string phone)
{
    for (const Contact &contact : contacts)
    {
        if (contact.getPhone() == phone)
            return true;
    }

    return false;
}