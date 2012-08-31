package models;

import play.data.validation.Required;

import javax.persistence.Embeddable;

@Embeddable
public class Partner
{
    @Required
    public String code = "";

    @Required
    public String name = "";

    public boolean isClient;
    public boolean isPartner;

    public String address = "";
    public String city = "";
    public String bankAccount = "";
    public String bankName = "";
    public String fiscalCode = "";
    public String regcom = "";
    public String phone = "";
    public String email = "";
    public String contact = "";
}
