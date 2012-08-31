import models.Client;
import models.Partner;
import play.jobs.Job;
import play.jobs.OnApplicationStart;
import play.test.Fixtures;

@OnApplicationStart
public class Bootstrap extends Job
{

    public void doJob() {

        Fixtures.deleteAllModels();
        Fixtures.loadModels("initial-data.yml");
    }

}