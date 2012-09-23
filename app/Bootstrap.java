import models.Client;
import models.Partner;
import play.jobs.Job;
import play.jobs.OnApplicationStart;
import play.test.Fixtures;

import java.util.TimeZone;

@OnApplicationStart
public class Bootstrap extends Job
{

    public void doJob() {

        //TimeZone.setDefault(TimeZone.getTimeZone("Etc/UTC"));

        Fixtures.deleteAllModels();
        Fixtures.loadModels("initial-data.yml");
    }

}