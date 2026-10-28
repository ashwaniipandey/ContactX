#include "Contact.h"

Contact::Contact()
{
    name = "";
    phone = "";
    email = "";
    address = "";
    favorite = false;
    dateAdded = "";
}

Contact::Contact(string name,
                 string phone,
                 string email,
                 string address,
                 bool favorite,
                 string dateAdded)
{
    this->name = name;
    this->phone = phone;
    this->email = email;
    this->address = address;
    this->favorite = favorite;
    this->dateAdded = dateAdded;
}

string Contact::getName() const
{
    return name;
}

string Contact::getPhone() const
{
    return phone;
}

string Contact::getEmail() const
{
    return email;
}

string Contact::getAddress() const
{
    return address;
}

bool Contact::getFavorite() const
{
    return favorite;
}

string Contact::getDateAdded() const
{
    return dateAdded;
}

void Contact::setName(string name)
{
    this->name = name;
}

void Contact::setPhone(string phone)
{
    this->phone = phone;
}

void Contact::setEmail(string email)
{
    this->email = email;
}

void Contact::setAddress(string address)
{
    this->address = address;
}

void Contact::setFavorite(bool favorite)
{
    this->favorite = favorite;
}

void Contact::setDateAdded(string dateAdded)
{
    this->dateAdded = dateAdded;
}

void Contact::display() const
{
    cout << "----------------------------------------" << endl;
    cout << "Name      : " << name << endl;
    cout << "Phone     : " << phone << endl;
    cout << "Email     : " << email << endl;
    cout << "Address   : " << address << endl;
    cout << "Favorite  : " << (favorite ? "Yes" : "No") << endl;
    cout << "Date Added: " << dateAdded << endl;
    cout << "----------------------------------------" << endl;
}